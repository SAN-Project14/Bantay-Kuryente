import React, { useState, useRef } from 'react';
import {
  Settings,
  Zap,
  Target,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Check,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { storageService } from '../../services/storage';
import { UserSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';
import { BillBreakdownModal } from './BillBreakdownModal';
import { RateGuideModal } from './RateGuideModal';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onLoadSample: () => void;
  onResetApp: () => void;
  onOpenMeterGuide: () => void;
  onDataImported: () => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onLoadSample,
  onResetApp,
  onOpenMeterGuide,
  onDataImported,
  showToast,
}) => {
  // Local form states
  const [householdName, setHouseholdName] = useState(settings.householdName);
  const [electricityRate, setElectricityRate] = useState(settings.electricityRate.toString());
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [billingCycleStartDay, setBillingCycleStartDay] = useState(
    settings.billingCycleStartDay.toString()
  );

  React.useEffect(() => {
    setHouseholdName(settings.householdName);
    setElectricityRate(settings.electricityRate.toString());
    setMonthlyBudget(settings.monthlyBudget.toString());
    setBillingCycleStartDay(settings.billingCycleStartDay.toString());
  }, [settings.householdName, settings.electricityRate, settings.monthlyBudget, settings.billingCycleStartDay]);

  // Modals
  const [isRateGuideOpen, setIsRateGuideOpen] = useState(false);
  const [isBillBreakdownOpen, setIsBillBreakdownOpen] = useState(false);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(electricityRate);
    const budgetNum = parseFloat(monthlyBudget);
    const cycleDay = parseInt(billingCycleStartDay, 10);

    if (isNaN(rateNum) || rateNum <= 0) {
      showToast('Please enter a valid electricity rate (greater than 0).', 'error');
      return;
    }

    if (isNaN(budgetNum) || budgetNum < 0) {
      showToast('Please enter a valid monthly budget.', 'error');
      return;
    }

    if (isNaN(cycleDay) || cycleDay < 1 || cycleDay > 31) {
      showToast('Billing cycle start day must be between 1 and 31.', 'error');
      return;
    }

    onUpdateSettings({
      householdName: householdName.trim() || 'My Household',
      electricityRate: Number(rateNum.toFixed(2)),
      monthlyBudget: Number(budgetNum.toFixed(2)),
      billingCycleStartDay: cycleDay,
    });

    showToast('Settings saved successfully!', 'success');
  };

  // Export JSON backup
  const handleExportBackup = () => {
    try {
      const jsonString = storageService.exportBackup();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bantay-kuryente-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Backup downloaded successfully!', 'success');
    } catch (e: any) {
      showToast('Failed to export data: ' + e.message, 'error');
    }
  };

  // Import JSON backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = storageService.importBackup(content);
        if (result.success) {
          showToast(result.message, 'success');
          onDataImported();
        } else {
          showToast(result.message, 'error');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/90">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure electricity rates, monthly budgets, and manage offline data
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Household & Billing Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            These values are used to calculate daily and monthly cost projections
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Household Name */}
          <div>
            <label htmlFor="settings-name" className="text-xs font-bold text-slate-700 block mb-1.5">
              Household / Unit Name
            </label>
            <input
              id="settings-name"
              type="text"
              required
              placeholder="e.g. Cruz Residence, Apt 3B"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Electricity Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="settings-rate" className="text-xs font-bold text-slate-700">
                Electricity Rate (₱/kWh)
              </label>
              <button
                type="button"
                onClick={() => setIsRateGuideOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Find on bill
              </button>
            </div>
            <div className="relative">
              <input
                id="settings-rate"
                type="number"
                step="0.01"
                min="0.1"
                max="100"
                required
                placeholder="11.50"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                ₱ / kWh
              </span>
            </div>
          </div>

          {/* Monthly Budget */}
          <div>
            <label htmlFor="settings-budget" className="text-xs font-bold text-slate-700 block mb-1.5">
              Monthly Budget Target (₱)
            </label>
            <div className="relative">
              <input
                id="settings-budget"
                type="number"
                step="50"
                min="0"
                required
                placeholder="3500"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                PHP (₱)
              </span>
            </div>
          </div>

          {/* Billing Cycle Start Day */}
          <div>
            <label htmlFor="settings-cycle-day" className="text-xs font-bold text-slate-700 block mb-1.5">
              Billing Cycle Start Day (1 - 31)
            </label>
            <input
              id="settings-cycle-day"
              type="number"
              min="1"
              max="31"
              required
              placeholder="1"
              value={billingCycleStartDay}
              onChange={(e) => setBillingCycleStartDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              The day of the month your utility reads your meter
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            id="save-settings-btn"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-white" />
            Save Settings
          </button>
        </div>
      </form>

      {/* Guides & Educational Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Guides & Electricity Knowledge
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Learn how electrical billing and meter readings work in the Philippines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onOpenMeterGuide}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex flex-col justify-between hover:border-slate-300 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Reading Meters</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visual guide on reading digital LCD, dial analog, and sub-meters.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setIsRateGuideOpen(true)}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex flex-col justify-between hover:border-slate-300 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Rate Calculator</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compute your exact effective per-kWh rate from your latest bill.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setIsBillBreakdownOpen(true)}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex flex-col justify-between hover:border-slate-300 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Bill Breakdown</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand generation, distribution, transmission, and taxes.
            </p>
          </button>
        </div>
      </div>

      {/* Data Management & Portability */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Data Management & Portability
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your data belongs to you. Export or restore your logs anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export JSON */}
          <button
            type="button"
            id="export-data-btn"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            type="button"
            id="import-data-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 shadow-2xs"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Import Backup</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Load Sample Data */}
          <button
            type="button"
            id="load-sample-settings-btn"
            onClick={onLoadSample}
            className="px-4 py-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-800 transition-all flex items-center gap-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Sample Data</span>
          </button>

          {/* Reset App */}
          <button
            type="button"
            id="reset-app-btn"
            onClick={onResetApp}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-all flex items-center gap-2 sm:ml-auto shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Application</span>
          </button>
        </div>
      </div>

      {/* Offline & Privacy Assurance */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Offline-First & Local Storage Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Bantay Kuryente works 100% offline. All readings, rate settings, and appliance logs are saved strictly in your browser's local storage. No account creation, cloud telemetry, or internet access is required.
        </p>
      </div>

      {/* Modals */}
      <RateGuideModal
        isOpen={isRateGuideOpen}
        onClose={() => setIsRateGuideOpen(false)}
        onApplyRate={(newRate) => {
          setElectricityRate(newRate.toString());
          onUpdateSettings({ electricityRate: newRate });
          showToast(`Rate updated to ₱${newRate.toFixed(2)}/kWh`, 'success');
        }}
      />

      <BillBreakdownModal
        isOpen={isBillBreakdownOpen}
        onClose={() => setIsBillBreakdownOpen(false)}
      />
    </div>
  );
};

