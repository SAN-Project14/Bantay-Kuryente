import React, { useState } from 'react';
import {
  Zap,
  Gauge,
  Target,
  Home,
  Check,
  X,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { UserSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface SetupBaseDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBaseData: (data: {
    electricityRate: number;
    initialReading?: number;
    monthlyBudget: number;
    householdName?: string;
  }) => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
  settings: UserSettings;
}

const COMMON_PH_RATES = [
  { label: 'Meralco / NCR', rate: 11.85 },
  { label: 'VECO / Cebu', rate: 11.50 },
  { label: 'Davao Light', rate: 10.20 },
  { label: 'Sub-meter / Rent', rate: 13.00 },
];

export const SetupBaseDataModal: React.FC<SetupBaseDataModalProps> = ({
  isOpen,
  onClose,
  onSaveBaseData,
  onLoadSample,
  onOpenGuide,
  settings,
}) => {
  const [rate, setRate] = useState<string>(
    settings.electricityRate > 0 ? settings.electricityRate.toString() : ''
  );
  const [initialReading, setInitialReading] = useState<string>('');
  const [budget, setBudget] = useState<string>(
    settings.monthlyBudget > 0 ? settings.monthlyBudget.toString() : ''
  );
  const [householdName, setHouseholdName] = useState<string>(
    settings.householdName && settings.householdName !== 'My Household'
      ? settings.householdName
      : ''
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numRate = parseFloat(rate);
    const numBudget = parseFloat(budget) || 0;
    const numReading = parseFloat(initialReading);

    if (!rate || isNaN(numRate) || numRate <= 0) {
      setError('Please enter a valid electricity rate (e.g. ₱11.50/kWh).');
      return;
    }

    if (initialReading && (isNaN(numReading) || numReading < 0)) {
      setError('Please enter a valid meter reading or leave it blank.');
      return;
    }

    onSaveBaseData({
      electricityRate: numRate,
      monthlyBudget: numBudget,
      initialReading: !isNaN(numReading) && numReading >= 0 ? numReading : undefined,
      householdName: householdName.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      id="setup-base-data-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="setup-base-data-content"
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 id="setup-modal-title" className="text-base sm:text-lg font-black text-slate-900">
                Set Up Base Data
              </h2>
              <p className="text-xs text-slate-500">
                Configure your rate, initial meter baseline, and budget
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* 1. Electricity Rate Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="setup-rate-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Electricity Rate (₱ per kWh)</span>
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                Find on bill
              </button>
            </div>
            <div className="relative">
              <input
                id="setup-rate-input"
                type="number"
                step="0.01"
                min="0.1"
                required
                placeholder="e.g. 11.50"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 font-mono-num placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                ₱ / kWh
              </span>
            </div>

            {/* Quick Philippine Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                Typical:
              </span>
              {COMMON_PH_RATES.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setRate(item.rate.toFixed(2))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-[11px] font-semibold text-slate-700 transition-colors border border-slate-200/60"
                >
                  {item.label} ({formatCurrency(item.rate)}/kWh)
                </button>
              ))}
            </div>
          </div>

          {/* 2. Initial Meter Reading */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="setup-reading-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-500" />
                <span>Initial / Current Meter Reading (kWh)</span>
                <span className="text-[11px] font-normal text-slate-400">(recommended baseline)</span>
              </label>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                How to read meter
              </button>
            </div>
            <div className="relative">
              <input
                id="setup-reading-input"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 2150.0"
                value={initialReading}
                onChange={(e) => setInitialReading(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 font-mono-num placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                kWh
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Recording your starting dial establishes your baseline. Subsequent readings will automatically compute consumed kilowatt-hours.
            </p>
          </div>

          {/* 3. Monthly Budget Limit */}
          <div className="space-y-1.5">
            <label htmlFor="setup-budget-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>Monthly Budget Limit (₱)</span>
              <span className="text-[11px] font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="setup-budget-input"
                type="number"
                step="50"
                min="0"
                placeholder="e.g. 3500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono-num placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                PHP (₱)
              </span>
            </div>
          </div>

          {/* 4. Household Name */}
          <div className="space-y-1.5">
            <label htmlFor="setup-household-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Household / Unit Name</span>
              <span className="text-[11px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="setup-household-input"
              type="text"
              placeholder="e.g. Cruz Residence, Unit 4B"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Saved locally on this device. No account or sign-up required.</span>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onLoadSample();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Demo Data</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                id="setup-submit-btn"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Save Base Data</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
