import React, { useState, useEffect } from 'react';
import { X, Zap, Check, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { PRESET_APPLIANCES } from '../../data/presetAppliances';
import { Appliance, ApplianceCategory, PresetApplianceItem, UserSettings } from '../../types';
import { calculateApplianceStats, formatCurrency } from '../../utils/calculations';

interface ApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appliance: Omit<Appliance, 'id'>, editId?: string) => void;
  editingAppliance?: Appliance | null;
  settings: UserSettings;
}

const CATEGORIES: ApplianceCategory[] = [
  'Cooling',
  'Kitchen',
  'Entertainment',
  'Laundry',
  'Lighting',
  'Work & Tech',
  'Water & Heating',
  'Other',
];

export const ApplianceModal: React.FC<ApplianceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAppliance,
  settings,
}) => {
  const isEditing = !!editingAppliance;

  const [name, setName] = useState('');
  const [watts, setWatts] = useState<string>('800');
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('7');
  const [quantity, setQuantity] = useState<string>('1');
  const [category, setCategory] = useState<ApplianceCategory>('Cooling');
  const [isInverter, setIsInverter] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editingAppliance) {
        setName(editingAppliance.name);
        setWatts(editingAppliance.watts.toString());
        setHoursPerDay(editingAppliance.hoursPerDay.toString());
        setDaysPerWeek(editingAppliance.daysPerWeek.toString());
        setQuantity((editingAppliance.quantity || 1).toString());
        setCategory(editingAppliance.category);
        setIsInverter(!!editingAppliance.isInverter);
        setNotes(editingAppliance.notes || '');
      } else {
        setName('');
        setWatts('800');
        setHoursPerDay('8');
        setDaysPerWeek('7');
        setQuantity('1');
        setCategory('Cooling');
        setIsInverter(false);
        setNotes('');
      }
    }
  }, [isOpen, editingAppliance]);

  if (!isOpen) return null;

  // Preset selector
  const handleSelectPreset = (preset: PresetApplianceItem) => {
    setName(preset.name);
    setWatts(preset.defaultWatts.toString());
    setHoursPerDay(preset.typicalHoursPerDay.toString());
    setDaysPerWeek(preset.typicalDaysPerWeek.toString());
    setCategory(preset.category);
    setIsInverter(!!preset.isInverter);
    if (preset.tip) {
      setNotes(preset.tip);
    }
  };

  // Real-time calculation preview
  const numWatts = parseFloat(watts) || 0;
  const numHours = parseFloat(hoursPerDay) || 0;
  const numDays = parseFloat(daysPerWeek) || 0;
  const numQty = parseInt(quantity, 10) || 1;

  const tempAppliance: Appliance = {
    id: 'temp',
    name: name || 'Appliance',
    watts: numWatts,
    hoursPerDay: numHours,
    daysPerWeek: numDays,
    quantity: numQty,
    category,
    isInverter,
  };

  const stats = calculateApplianceStats(tempAppliance, settings.electricityRate || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter an appliance name.');
      return;
    }

    if (numWatts <= 0) {
      setError('Appliance wattage must be greater than 0.');
      return;
    }

    if (numHours <= 0 || numHours > 24) {
      setError('Hours per day must be between 0.1 and 24 hours.');
      return;
    }

    if (numDays <= 0 || numDays > 7) {
      setError('Days per week must be between 1 and 7 days.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        watts: numWatts,
        hoursPerDay: numHours,
        daysPerWeek: numDays,
        quantity: numQty,
        category,
        isInverter,
        notes: notes.trim() || undefined,
      },
      editingAppliance ? editingAppliance.id : undefined
    );
  };

  return (
    <div
      id="appliance-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="appliance-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-[#E7E5E4] text-[#171717] animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appliance-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 id="appliance-modal-title" className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Appliance' : 'Add Appliance'}
              </h2>
              <p className="text-xs text-slate-500">
                Estimate power usage based on wattage and operating hours
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Quick Picker (only on new appliance) */}
          {!isEditing && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Fill from Popular Appliances</span>
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                {PRESET_APPLIANCES.slice(0, 7).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 whitespace-nowrap transition-colors flex-shrink-0"
                  >
                    {preset.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="app-name" className="text-xs font-bold text-slate-700 block mb-1.5">
                Appliance Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="app-name"
                type="text"
                required
                placeholder="e.g. Master Bedroom Inverter AC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="app-category" className="text-xs font-bold text-slate-700 block mb-1.5">
                Category
              </label>
              <select
                id="app-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Watts & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="app-watts" className="text-xs font-bold text-slate-700 block mb-1.5">
                Power (Watts) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="app-watts"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="15000"
                  required
                  placeholder="e.g. 800"
                  value={watts}
                  onChange={(e) => setWatts(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                  W
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="app-qty" className="text-xs font-bold text-slate-700 block mb-1.5">
                Quantity / Units
              </label>
              <input
                id="app-qty"
                type="number"
                inputMode="numeric"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Hours/day & Days/week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="app-hours" className="text-xs font-bold text-slate-700 block mb-1.5">
                Hours used per day
              </label>
              <div className="relative">
                <input
                  id="app-hours"
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="24"
                  required
                  placeholder="8"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  hrs
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="app-days" className="text-xs font-bold text-slate-700 block mb-1.5">
                Days used per week
              </label>
              <div className="relative">
                <input
                  id="app-days"
                  type="number"
                  min="1"
                  max="7"
                  required
                  placeholder="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  days
                </span>
              </div>
            </div>
          </div>

          {/* Inverter Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Inverter Technology</span>
              <span className="text-[11px] text-slate-500">
                Appliance uses an energy-saving inverter compressor or motor
              </span>
            </div>
            <input
              type="checkbox"
              id="app-inverter"
              checked={isInverter}
              onChange={(e) => setIsInverter(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Live Calculation Preview Card */}
          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-emerald-800">Estimated Monthly Consumption</span>
              <span className="font-extrabold text-slate-900 font-mono-num">~{stats.monthlyKwh} kWh/mo</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-emerald-200 text-xs">
              <span className="text-slate-600">Estimated Monthly Cost (@ {formatCurrency(settings.electricityRate || 0)}/kWh)</span>
              <span className="text-sm font-black text-emerald-700 font-mono-num">
                {formatCurrency(stats.monthlyCost, settings.currency)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="app-notes" className="text-xs font-bold text-slate-700 block mb-1.5">
              Efficiency Notes / Tips <span className="text-[11px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="app-notes"
              type="text"
              placeholder="e.g. Set to 24°C, cleaned monthly"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-appliance-btn"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-white" />
              {isEditing ? 'Update Appliance' : 'Save Appliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
