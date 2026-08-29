import React, { useState, useEffect, useMemo } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { AppShell, ActiveTabType } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { HistoryView } from './components/history/HistoryView';
import { AppliancesView } from './components/appliances/AppliancesView';
import { SettingsView } from './components/settings/SettingsView';
import { MeterReadingModal } from './components/meter/MeterReadingModal';
import { MeterGuideModal } from './components/meter/MeterGuideModal';
import { ApplianceModal } from './components/appliances/ApplianceModal';
import { SetupBaseDataModal } from './components/dashboard/SetupBaseDataModal';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { storageService, DEFAULT_SETTINGS } from './services/storage';
import {
  Appliance,
  MeterReading,
  PresetApplianceItem,
  UserSettings,
} from './types';
import { calculateBillingStats, generateDynamicInsights, sortReadings } from './utils/calculations';

interface MainAppProps {
  initialOpenSetup?: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ initialOpenSetup = false }) => {
  const { showToast } = useToast();

  // Primary persistent state
  const [settings, setSettings] = useState<UserSettings>(() => storageService.loadSettings());
  const [readings, setReadings] = useState<MeterReading[]>(() => storageService.loadReadings());
  const [appliances, setAppliances] = useState<Appliance[]>(() => storageService.loadAppliances());

  // UI view state
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');

  // Modal states
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(() => {
    if (initialOpenSetup) return true;
    const savedSettings = storageService.loadSettings();
    const savedReadings = storageService.loadReadings();
    return !savedSettings.isOnboarded && savedReadings.length === 0 && savedSettings.electricityRate === 0;
  });
  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<MeterReading | null>(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [isApplianceModalOpen, setIsApplianceModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  // Handle PWA App Shortcuts (e.g. ?action=record)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'record') {
        setIsMeterModalOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    } catch {
      // Ignore if window.location is unavailable
    }
  }, []);

  // Deletion confirm states
  const [deletingReading, setDeletingReading] = useState<MeterReading | null>(null);
  const [deletingAppliance, setDeletingAppliance] = useState<Appliance | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Compute billing stats and insights reactively
  const stats = useMemo(() => {
    return calculateBillingStats(readings, settings);
  }, [readings, settings]);

  const insights = useMemo(() => {
    return generateDynamicInsights(stats, appliances, settings);
  }, [stats, appliances, settings]);

  // Latest reading for meter modal baseline
  const sortedDescReadings = useMemo(() => sortReadings(readings, 'desc'), [readings]);
  const latestReading = sortedDescReadings.length > 0 ? sortedDescReadings[0] : undefined;

  // Handlers for base data setup
  const handleSaveBaseData = (data: {
    electricityRate: number;
    initialReading?: number;
    monthlyBudget: number;
    householdName?: string;
  }) => {
    const updatedSettings: UserSettings = {
      ...settings,
      electricityRate: data.electricityRate,
      monthlyBudget: data.monthlyBudget,
      householdName: data.householdName || settings.householdName,
      isOnboarded: true,
    };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);

    if (data.initialReading !== undefined && data.initialReading >= 0) {
      const today = new Date().toISOString().split('T')[0];
      const updatedReadings = storageService.addReading({
        reading: data.initialReading,
        date: today,
        notes: 'Initial baseline meter reading',
      });
      setReadings(updatedReadings);
    }

    showToast('Base data saved! Dashboard updated in real time.', 'success');
  };

  // Handlers for settings
  const handleUpdateSettings = (newFields: Partial<UserSettings>) => {
    const updated = { ...settings, ...newFields };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Handlers for meter readings
  const handleOpenAddReading = () => {
    setEditingReading(null);
    setIsMeterModalOpen(true);
  };

  const handleOpenEditReading = (reading: MeterReading) => {
    setEditingReading(reading);
    setIsMeterModalOpen(true);
  };

  const handleSaveReading = (
    readingData: { reading: number; date: string; notes?: string },
    editId?: string
  ) => {
    if (editId) {
      const updated = storageService.updateReading(editId, readingData);
      setReadings(updated);
      showToast('Meter reading updated successfully.', 'success');
    } else {
      const updated = storageService.addReading(readingData);
      setReadings(updated);
      showToast('New meter reading recorded!', 'success');
    }
    setIsMeterModalOpen(false);
    setEditingReading(null);
  };

  const handleDeleteReading = () => {
    if (!deletingReading) return;
    const updated = storageService.deleteReading(deletingReading.id);
    setReadings(updated);
    showToast('Meter reading deleted.', 'info');
    setDeletingReading(null);
  };

  // Handlers for appliances
  const handleOpenAddAppliance = (preset?: PresetApplianceItem) => {
    if (preset) {
      const newApp = {
        name: preset.name,
        watts: preset.defaultWatts,
        hoursPerDay: preset.typicalHoursPerDay,
        daysPerWeek: preset.typicalDaysPerWeek,
        quantity: 1,
        category: preset.category,
        isInverter: !!preset.isInverter,
        notes: preset.tip,
      };
      const updated = storageService.addAppliance(newApp);
      setAppliances(updated);
      showToast(`Added ${preset.name.split(' (')[0]} to your appliances!`, 'success');
      return;
    }
    setEditingAppliance(null);
    setIsApplianceModalOpen(true);
  };

  const handleOpenEditAppliance = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsApplianceModalOpen(true);
  };

  const handleSaveAppliance = (appData: Omit<Appliance, 'id'>, editId?: string) => {
    if (editId) {
      const updated = storageService.updateAppliance(editId, appData);
      setAppliances(updated);
      showToast('Appliance updated.', 'success');
    } else {
      const updated = storageService.addAppliance(appData);
      setAppliances(updated);
      showToast('Appliance added.', 'success');
    }
    setIsApplianceModalOpen(false);
    setEditingAppliance(null);
  };

  const handleDeleteAppliance = () => {
    if (!deletingAppliance) return;
    const updated = storageService.deleteAppliance(deletingAppliance.id);
    setAppliances(updated);
    showToast('Appliance removed.', 'info');
    setDeletingAppliance(null);
  };

  // Sample data loader
  const handleLoadSampleData = () => {
    const { settings: newSettings, readings: newReadings, appliances: newAppliances } =
      storageService.loadSampleData();
    setSettings(newSettings);
    setReadings(newReadings);
    setAppliances(newAppliances);
    showToast('Sample Filipino household data loaded!', 'success');
    setActiveTab('dashboard');
  };

  // Reset application
  const handleResetApplication = () => {
    storageService.clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setReadings([]);
    setAppliances([]);
    setIsResetConfirmOpen(false);
    showToast('Application reset to empty state.', 'info');
    setActiveTab('dashboard');
  };

  // Callback when JSON backup is imported
  const handleDataImported = () => {
    setSettings(storageService.loadSettings());
    setReadings(storageService.loadReadings());
    setAppliances(storageService.loadAppliances());
    setActiveTab('dashboard');
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddReading={handleOpenAddReading}
      settings={settings}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          stats={stats}
          settings={settings}
          appliances={appliances}
          readings={readings}
          insights={insights}
          onAddReading={handleOpenAddReading}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
          onOpenGuide={() => setIsGuideModalOpen(true)}
          onLoadSample={handleLoadSampleData}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'history' && (
        <HistoryView
          readings={readings}
          stats={stats}
          settings={settings}
          onAddReading={handleOpenAddReading}
          onEditReading={handleOpenEditReading}
          onDeleteReading={(r) => setDeletingReading(r)}
        />
      )}

      {activeTab === 'appliances' && (
        <AppliancesView
          appliances={appliances}
          settings={settings}
          onAddAppliance={handleOpenAddAppliance}
          onEditAppliance={handleOpenEditAppliance}
          onDeleteAppliance={(a) => setDeletingAppliance(a)}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onLoadSample={handleLoadSampleData}
          onResetApp={() => setIsResetConfirmOpen(true)}
          onOpenMeterGuide={() => setIsGuideModalOpen(true)}
          onDataImported={handleDataImported}
          showToast={showToast}
        />
      )}

      {/* Base Data Setup Modal */}
      <SetupBaseDataModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onSaveBaseData={handleSaveBaseData}
        onLoadSample={handleLoadSampleData}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        settings={settings}
      />

      {/* Meter Reading Modal */}
      <MeterReadingModal
        isOpen={isMeterModalOpen}
        onClose={() => {
          setIsMeterModalOpen(false);
          setEditingReading(null);
        }}
        onSave={handleSaveReading}
        latestReading={latestReading}
        editingReading={editingReading}
        settings={settings}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Meter Reading Guide */}
      <MeterGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Appliance Modal */}
      <ApplianceModal
        isOpen={isApplianceModalOpen}
        onClose={() => {
          setIsApplianceModalOpen(false);
          setEditingAppliance(null);
        }}
        onSave={handleSaveAppliance}
        editingAppliance={editingAppliance}
        settings={settings}
      />

      {/* Confirm Delete Reading Dialog */}
      <ConfirmDialog
        isOpen={!!deletingReading}
        title="Delete Meter Reading"
        description={`Are you sure you want to delete the meter reading of ${deletingReading?.reading} kWh recorded on ${deletingReading?.date}? Subsequent consumption calculations will adjust automatically.`}
        confirmLabel="Delete Reading"
        isDestructive
        onConfirm={handleDeleteReading}
        onCancel={() => setDeletingReading(null)}
      />

      {/* Confirm Delete Appliance Dialog */}
      <ConfirmDialog
        isOpen={!!deletingAppliance}
        title="Delete Appliance"
        description={`Are you sure you want to remove "${deletingAppliance?.name}" from your tracked appliances?`}
        confirmLabel="Delete Appliance"
        isDestructive
        onConfirm={handleDeleteAppliance}
        onCancel={() => setDeletingAppliance(null)}
      />

      {/* Confirm Reset App Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Entire Application"
        description="This will permanently delete all your recorded meter readings, tracked appliances, and custom settings stored on this device. This action cannot be undone. We recommend exporting a backup first."
        confirmLabel="Reset Everything"
        isDestructive
        onConfirm={handleResetApplication}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </AppShell>
  );
};

export default function App() {
  const [appStage, setAppStage] = useState<'splash' | 'welcome' | 'main'>('splash');
  const [shouldAutoOpenSetup, setShouldAutoOpenSetup] = useState(false);

  const handleSplashFinish = () => {
    const isCompleted = storageService.isOnboardingCompleted();
    if (isCompleted) {
      setAppStage('main');
    } else {
      setAppStage('welcome');
    }
  };

  const handleGetStarted = () => {
    storageService.setOnboardingCompleted(true);
    setShouldAutoOpenSetup(true);
    setAppStage('main');
  };

  return (
    <ToastProvider>
      {appStage === 'splash' && (
        <SplashScreen
          onFinish={handleSplashFinish}
          isFirstLaunch={!storageService.isOnboardingCompleted()}
        />
      )}
      {appStage === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      {appStage === 'main' && (
        <MainApp initialOpenSetup={shouldAutoOpenSetup} />
      )}
    </ToastProvider>
  );
}
