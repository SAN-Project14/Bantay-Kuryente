export type ConsumptionStatusType = 'NORMAL' | 'WATCH' | 'HIGH';

export interface UserSettings {
  householdName: string;
  electricityRate: number; // ₱ per kWh (e.g. 11.50)
  monthlyBudget: number; // ₱ (e.g. 3500)
  billingCycleStartDay: number; // 1 - 31 (day of month billing starts)
  currency: string; // '₱'
  targetAlertThresholdPercent?: number; // e.g. 15% increase triggers WATCH
  isOnboarded: boolean;
}

export interface MeterReading {
  id: string;
  date: string; // ISO format 'YYYY-MM-DD'
  reading: number; // Total meter reading in kWh (e.g. 1450.5)
  previousReading?: number;
  consumption?: number; // Calculated delta: reading - previousReading
  notes?: string;
  createdAt: string;
}

export type ApplianceCategory = 
  | 'Cooling'
  | 'Kitchen'
  | 'Entertainment'
  | 'Laundry'
  | 'Lighting'
  | 'Work & Tech'
  | 'Water & Heating'
  | 'Other';

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  daysPerWeek: number;
  quantity: number;
  category: ApplianceCategory;
  notes?: string;
  isInverter?: boolean;
}

export interface PresetApplianceItem {
  name: string;
  defaultWatts: number;
  typicalHoursPerDay: number;
  typicalDaysPerWeek: number;
  category: ApplianceCategory;
  isInverter?: boolean;
  tip?: string;
}

export interface BillingCycleStats {
  hasReadings: boolean;
  totalReadingsCount: number;
  latestReading?: MeterReading;
  previousReading?: MeterReading;
  currentPeriodConsumption: number; // kWh
  currentEstimatedCost: number; // ₱
  dailyAverageKwh: number; // kWh/day
  projectedMonthlyKwh: number; // kWh
  projectedMonthlyCost: number; // ₱
  budgetRemaining: number; // ₱ (budget - currentEstimatedCost)
  budgetVariance: number; // ₱ (projectedCost - budget; positive = over budget)
  budgetProgressPercent: number; // percentage of budget consumed so far
  consumptionStatus: ConsumptionStatusType;
  statusMessage: string;
  daysInCurrentCycle: number;
  daysRemainingInCycle: number;
  cycleStartDate: string;
  cycleEndDate: string;
  historicalComparison?: {
    percentChange: number; // positive = increase, negative = decrease
    differenceKwh: number;
    differenceCost: number;
    priorPeriodName: string;
  };
}

export interface DynamicInsight {
  id: string;
  type: 'info' | 'warning' | 'positive' | 'tip';
  title: string;
  description: string;
  actionLabel?: string;
  actionView?: 'meter' | 'appliances' | 'settings' | 'history';
}

export interface BackupData {
  version: string;
  exportedAt: string;
  settings: UserSettings;
  readings: MeterReading[];
  appliances: Appliance[];
}
