import React from 'react';
import {
  Plus,
  Zap,
  Gauge,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Settings as SettingsIcon,
  History,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  Appliance,
  BillingCycleStats,
  DynamicInsight,
  MeterReading,
  UserSettings,
} from '../../types';
import { formatCurrency, formatDate, formatKwh } from '../../utils/calculations';
import { BudgetProgressCard } from './BudgetProgressCard';
import { ConsumptionStatusBadge } from './ConsumptionStatusBadge';
import { DynamicInsightCard } from './DynamicInsightCard';
import { MetricCard } from './MetricCard';
import { QuickApplianceSummary } from './QuickApplianceSummary';

interface DashboardViewProps {
  stats: BillingCycleStats;
  settings: UserSettings;
  appliances: Appliance[];
  readings: MeterReading[];
  insights: DynamicInsight[];
  onAddReading: () => void;
  onOpenSetupModal: () => void;
  onOpenGuide: () => void;
  onLoadSample: () => void;
  onNavigate: (view: 'dashboard' | 'history' | 'appliances' | 'settings') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  settings,
  appliances,
  readings,
  insights,
  onAddReading,
  onOpenSetupModal,
  onOpenGuide,
  onLoadSample,
  onNavigate,
}) => {
  // Format cycle range
  const cycleText = `Billing cycle: ${formatDate(stats.cycleStartDate, {
    month: 'short',
    day: 'numeric',
  })} – ${formatDate(stats.cycleEndDate, {
    month: 'short',
    day: 'numeric',
  })}`;

  const hasMultipleReadings = stats.totalReadingsCount > 1;
  const isZeroState = readings.length === 0 && settings.electricityRate === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Aligned Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {settings.householdName || 'My Household'}
            </h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              Active Billing Cycle
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{cycleText}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="font-semibold text-slate-700">
              Day {stats.daysInCurrentCycle} of 30
            </span>
          </p>
        </div>

        {/* Primary Header Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={onOpenSetupModal}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]"
            title="Set base electricity rate, meter reading, and budget"
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Set Up Base Data</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]"
            title="How to read electric meter"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Meter Guide</span>
          </button>

          <button
            type="button"
            id="dash-add-reading-btn"
            onClick={onAddReading}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Record Reading</span>
          </button>
        </div>
      </div>

      {/* Zero State Callout Banner / Quick Setup Prompt */}
      {(!settings.isOnboarded || isZeroState) && (
        <div className="bg-gradient-to-r from-blue-50 via-white to-emerald-50/40 p-5 sm:p-6 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Welcome to Bantay Kuryente!
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Quick Start
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                Set up your electricity rate (₱/kWh), current meter reading, and target budget to start estimating your consumption in real time. Saved locally on this device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onOpenSetupModal}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Sliders className="w-4 h-4" />
              <span>Set Up Base Data</span>
            </button>
            <button
              type="button"
              onClick={onLoadSample}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 flex-shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* Consumption Status Banner */}
      <ConsumptionStatusBadge
        status={stats.consumptionStatus}
        message={stats.statusMessage}
        hasEnoughHistory={stats.totalReadingsCount >= 3}
      />

      {/* Primary Key Metrics Grid (Guaranteed Zero-State & Live Dynamic Updates) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Metric 1: Current Estimated Bill */}
        <MetricCard
          id="metric-current-cost"
          label="Current Estimated Bill"
          value={formatCurrency(stats.currentEstimatedCost, settings.currency)}
          subValue={`Rate: ${formatCurrency(settings.electricityRate || 0, settings.currency)}/kWh`}
          variant="amber"
          icon={<Zap className="w-4 h-4" />}
        />

        {/* Metric 2: Tracked Consumption */}
        <MetricCard
          id="metric-current-kwh"
          label="Tracked Consumption"
          value={formatKwh(stats.currentPeriodConsumption)}
          subValue={
            stats.latestReading
              ? `Meter: ${stats.latestReading.reading.toLocaleString('en-PH', { minimumFractionDigits: 1 })} kWh`
              : 'Meter: 0 kWh'
          }
          variant="emerald"
          icon={<Gauge className="w-4 h-4" />}
        />

        {/* Metric 3: Daily Average */}
        <MetricCard
          id="metric-daily-average"
          label="Daily Average"
          value={hasMultipleReadings ? `${stats.dailyAverageKwh} kWh` : '0 kWh'}
          subValue={
            hasMultipleReadings
              ? `~${formatCurrency(stats.dailyAverageKwh * (settings.electricityRate || 0), settings.currency)}/day`
              : `~${formatCurrency(0, settings.currency)}/day`
          }
          variant="primary"
          icon={<Clock className="w-4 h-4" />}
        />

        {/* Metric 4: Projected Monthly Bill */}
        <MetricCard
          id="metric-projected-bill"
          label="Projected Monthly Bill"
          value={
            hasMultipleReadings
              ? formatCurrency(stats.projectedMonthlyCost, settings.currency)
              : formatCurrency(0, settings.currency)
          }
          subValue={
            hasMultipleReadings
              ? `Forecast: ~${stats.projectedMonthlyKwh} kWh`
              : 'Forecast: 0 kWh'
          }
          variant="neutral"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Secondary Row: Budget Progress & Latest Reading Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BudgetProgressCard
          stats={stats}
          settings={settings}
          onEditBudget={() => onNavigate('settings')}
        />

        {/* Latest Recorded Reading Card */}
        {stats.latestReading ? (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Latest Meter Check
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Cumulative Meter Dial
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono-num text-slate-900">
                    {stats.latestReading.reading.toLocaleString('en-PH', { minimumFractionDigits: 1 })}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kWh</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                {formatDate(stats.latestReading.date)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="truncate max-w-[200px] sm:max-w-xs font-medium">
                {stats.latestReading.notes ? `Note: "${stats.latestReading.notes}"` : 'Initial baseline reading'}
              </span>
              <button
                type="button"
                onClick={onAddReading}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline flex-shrink-0 ml-2"
              >
                + Record New Reading
              </button>
            </div>
          </div>
        ) : (
          /* Empty baseline prompt card */
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Meter Baseline
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Meter Guide</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Current Meter Dial
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono-num text-slate-300">
                  0.0
                </span>
                <span className="text-xs font-bold text-slate-400">kWh</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                No meter readings recorded yet. Record your first reading to set your baseline.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={onAddReading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Baseline Reading</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Insights & Recommendations */}
      <DynamicInsightCard
        insights={insights}
        onActionClick={(view) => {
          if (view === 'meter') {
            onAddReading();
          } else {
            onNavigate(view);
          }
        }}
      />

      {/* Appliances Overview Widget */}
      <QuickApplianceSummary
        appliances={appliances}
        settings={settings}
        onNavigateToAppliances={() => onNavigate('appliances')}
        onAddAppliance={() => onNavigate('appliances')}
      />
    </div>
  );
};
