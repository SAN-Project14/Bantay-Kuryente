import {
  Appliance,
  BackupData,
  MeterReading,
  UserSettings,
} from '../types';
import { computeReadingDeltas, sortReadings } from '../utils/calculations';

const STORAGE_KEYS = {
  SETTINGS: 'bantay_kuryente_settings_v1',
  READINGS: 'bantay_kuryente_readings_v1',
  APPLIANCES: 'bantay_kuryente_appliances_v1',
  ONBOARDING_COMPLETED: 'bantayKuryente.onboardingCompleted',
};

export const DEFAULT_SETTINGS: UserSettings = {
  householdName: 'My Household',
  electricityRate: 0, // Default zero-state
  monthlyBudget: 0, // Default zero-state
  billingCycleStartDay: 1, // 1st of month
  currency: '₱',
  targetAlertThresholdPercent: 15,
  isOnboarded: false,
};

export const SAMPLE_APPLIANCES: Appliance[] = [
  {
    id: 'app-1',
    name: 'Inverter Aircon (1.0 HP Master Bed)',
    watts: 800,
    hoursPerDay: 8,
    daysPerWeek: 7,
    quantity: 1,
    category: 'Cooling',
    isInverter: true,
    notes: 'Set to 24°C nightly',
  },
  {
    id: 'app-2',
    name: 'Inverter Two-Door Refrigerator',
    watts: 120,
    hoursPerDay: 24,
    daysPerWeek: 7,
    quantity: 1,
    category: 'Kitchen',
    isInverter: true,
    notes: 'Runs continuously',
  },
  {
    id: 'app-3',
    name: 'Electric Stand Fan (Living Room)',
    watts: 65,
    hoursPerDay: 14,
    daysPerWeek: 7,
    quantity: 2,
    category: 'Cooling',
    isInverter: false,
  },
  {
    id: 'app-4',
    name: 'Smart TV 50"',
    watts: 95,
    hoursPerDay: 5,
    daysPerWeek: 7,
    quantity: 1,
    category: 'Entertainment',
    isInverter: false,
  },
  {
    id: 'app-5',
    name: 'Automatic Washing Machine',
    watts: 450,
    hoursPerDay: 1.5,
    daysPerWeek: 3,
    quantity: 1,
    category: 'Laundry',
    isInverter: true,
  },
  {
    id: 'app-6',
    name: 'Rice Cooker',
    watts: 500,
    hoursPerDay: 1,
    daysPerWeek: 7,
    quantity: 1,
    category: 'Kitchen',
    isInverter: false,
  },
  {
    id: 'app-7',
    name: 'Work Laptop & Monitor',
    watts: 90,
    hoursPerDay: 8,
    daysPerWeek: 5,
    quantity: 1,
    category: 'Work & Tech',
    isInverter: false,
  },
  {
    id: 'app-8',
    name: 'LED Home Lights (Total)',
    watts: 70,
    hoursPerDay: 6,
    daysPerWeek: 7,
    quantity: 1,
    category: 'Lighting',
    isInverter: false,
  },
];

export const SAMPLE_READINGS: MeterReading[] = [
  {
    id: 'read-1',
    date: '2026-06-01',
    reading: 2150.0,
    notes: 'Baseline June reading',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'read-2',
    date: '2026-07-01',
    reading: 2382.4,
    notes: 'End of June billing period',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'read-3',
    date: '2026-08-01',
    reading: 2628.0,
    notes: 'End of July billing period',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'read-4',
    date: '2026-08-15',
    reading: 2742.6,
    notes: 'Mid-month August check',
    createdAt: '2026-08-15T08:00:00.000Z',
  },
  {
    id: 'read-5',
    date: '2026-08-28',
    reading: 2855.2,
    notes: 'Latest meter check',
    createdAt: '2026-08-28T09:30:00.000Z',
  },
];

export const storageService = {
  // Settings
  loadSettings(): UserSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  },

  // Meter Readings
  loadReadings(): MeterReading[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READINGS);
      if (saved) {
        const parsed: MeterReading[] = JSON.parse(saved);
        return computeReadingDeltas(parsed);
      }
    } catch (e) {
      console.error('Error loading readings from localStorage', e);
    }
    return [];
  },

  saveReadings(readings: MeterReading[]): void {
    try {
      const sorted = sortReadings(readings, 'desc');
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(sorted));
    } catch (e) {
      console.error('Error saving readings to localStorage', e);
    }
  },

  addReading(reading: Omit<MeterReading, 'id' | 'createdAt'>): MeterReading[] {
    const current = this.loadReadings();
    const newEntry: MeterReading = {
      ...reading,
      id: `read-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = computeReadingDeltas([...current, newEntry]);
    this.saveReadings(updated);
    return updated;
  },

  updateReading(id: string, updatedFields: Partial<MeterReading>): MeterReading[] {
    const current = this.loadReadings();
    const updated = current.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
    const recomputed = computeReadingDeltas(updated);
    this.saveReadings(recomputed);
    return recomputed;
  },

  deleteReading(id: string): MeterReading[] {
    const current = this.loadReadings();
    const filtered = current.filter((r) => r.id !== id);
    const recomputed = computeReadingDeltas(filtered);
    this.saveReadings(recomputed);
    return recomputed;
  },

  // Appliances
  loadAppliances(): Appliance[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLIANCES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading appliances from localStorage', e);
    }
    return [];
  },

  saveAppliances(appliances: Appliance[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLIANCES, JSON.stringify(appliances));
    } catch (e) {
      console.error('Error saving appliances to localStorage', e);
    }
  },

  addAppliance(appliance: Omit<Appliance, 'id'>): Appliance[] {
    const current = this.loadAppliances();
    const newEntry: Appliance = {
      ...appliance,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newEntry, ...current];
    this.saveAppliances(updated);
    return updated;
  },

  updateAppliance(id: string, updatedFields: Partial<Appliance>): Appliance[] {
    const current = this.loadAppliances();
    const updated = current.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    this.saveAppliances(updated);
    return updated;
  },

  deleteAppliance(id: string): Appliance[] {
    const current = this.loadAppliances();
    const filtered = current.filter((a) => a.id !== id);
    this.saveAppliances(filtered);
    return filtered;
  },

  // Sample data seeder
  loadSampleData(): { settings: UserSettings; readings: MeterReading[]; appliances: Appliance[] } {
    const settings: UserSettings = {
      ...DEFAULT_SETTINGS,
      householdName: 'Cruz Family (Sample)',
      electricityRate: 11.85,
      monthlyBudget: 3800,
      billingCycleStartDay: 1,
      isOnboarded: true,
    };
    const readings = computeReadingDeltas(SAMPLE_READINGS);
    const appliances = SAMPLE_APPLIANCES;

    this.saveSettings(settings);
    this.saveReadings(readings);
    this.saveAppliances(appliances);

    return { settings, readings, appliances };
  },

  // Export / Import
  exportBackup(): string {
    const settings = this.loadSettings();
    const readings = this.loadReadings();
    const appliances = this.loadAppliances();

    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      readings,
      appliances,
    };

    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): { success: boolean; message: string; data?: BackupData } {
    try {
      const parsed: BackupData = JSON.parse(jsonString);
      if (!parsed.settings || !Array.isArray(parsed.readings) || !Array.isArray(parsed.appliances)) {
        return { success: false, message: 'Invalid backup format. Required fields missing.' };
      }

      this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings, isOnboarded: true });
      this.saveReadings(computeReadingDeltas(parsed.readings));
      this.saveAppliances(parsed.appliances);

      return {
        success: true,
        message: `Successfully restored ${parsed.readings.length} readings and ${parsed.appliances.length} appliances.`,
        data: parsed,
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse JSON file.' };
    }
  },

  // Onboarding status
  isOnboardingCompleted(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      if (val !== null) {
        return val === 'true';
      }
      // If user already has configured settings or saved readings, treat as onboarded
      const savedSettings = this.loadSettings();
      const savedReadings = this.loadReadings();
      if (savedSettings.isOnboarded || savedSettings.electricityRate > 0 || savedReadings.length > 0) {
        return true;
      }
    } catch (e) {
      console.error('Error checking onboarding status', e);
    }
    return false;
  },

  setOnboardingCompleted(completed: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving onboarding status', e);
    }
  },

  // Reset
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.READINGS);
      localStorage.removeItem(STORAGE_KEYS.APPLIANCES);
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    } catch (e) {
      console.error('Error clearing data', e);
    }
  },
};
