import React, { useState, useEffect } from 'react';
import { X, Gauge, HelpCircle, Calendar, FileText, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { MeterReading, UserSettings } from '../../types';
import { calculateConsumption, calculateEstimatedCost, formatCurrency, formatKwh } from '../../utils/calculations';

interface MeterReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reading: { reading: number; date: string; notes?: string }, editId?: string) => void;
  latestReading?: MeterReading;
  editingReading?: MeterReading | null;
  settings: UserSettings;
  onOpenGuide: () => void;
}

export const MeterReadingModal: React.FC<MeterReadingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  latestReading,
  editingReading,
  settings,
  onOpenGuide,
}) => {
  const isEditing = !!editingReading;

  // Form states
  const [currentValue, setCurrentValue] = useState<string>('');
  const [readingDate, setReadingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Baseline reference reading (previous reading)
  const previousValue = editingReading
    ? editingReading.previousReading ?? (latestReading ? latestReading.reading : 0)
    : latestReading
    ? latestReading.reading
    : 0;

  const hasPrevious = !!latestReading || (isEditing && editingReading?.previousReading !== undefined);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editingReading) {
        setCurrentValue(editingReading.reading.toString());
        setReadingDate(editingReading.date);
        setNotes(editingReading.notes || '');
      } else {
        // Reset for new reading
        setCurrentValue('');
        setReadingDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, editingReading]);

  if (!isOpen) return null;

  const numCurrent = parseFloat(currentValue);
  const isValidNum = !isNaN(numCurrent) && numCurrent >= 0;

  // Calculate delta consumption if previous exists
  let liveConsumption = 0;
  let liveCost = 0;
  if (isValidNum && hasPrevious) {
    liveConsumption = calculateConsumption(numCurrent, previousValue);
    liveCost = calculateEstimatedCost(liveConsumption, settings.electricityRate || 0);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentValue.trim()) {
      setError('Please enter your current meter reading numbers.');
      return;
    }

    if (isNaN(numCurrent) || numCurrent < 0) {
      setError('Meter reading must be a valid non-negative number.');
      return;
    }

    if (!readingDate) {
      setError('Please select a reading date.');
      return;
    }

    // If we have a previous reading and it's not the initial baseline reading
    if (hasPrevious && !isEditing && numCurrent < previousValue) {
      setError(
        `Current meter reading (${numCurrent} kWh) cannot be lower than the previous recorded reading (${previousValue} kWh).`
      );
      return;
    }

    onSave(
      {
        reading: Number(numCurrent.toFixed(2)),
        date: readingDate,
        notes: notes.trim() || undefined,
      },
      editingReading ? editingReading.id : undefined
    );
  };

  return (
    <div
      id="meter-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="meter-modal-content"
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="meter-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 id="meter-modal-title" className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Meter Reading' : 'Add Meter Reading'}
              </h2>
              <p className="text-xs text-slate-500">
                {hasPrevious
                  ? 'Record cumulative kWh from your electric meter'
                  : 'Record baseline reading to begin tracking'}
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
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Previous Reading Info */}
          {hasPrevious && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Previous Reading
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono-num">
                  {previousValue.toLocaleString('en-PH', { minimumFractionDigits: 1 })} kWh
                </span>
              </div>
              {latestReading && (
                <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {latestReading.date}
                </span>
              )}
            </div>
          )}

          {/* Current Reading Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="meter-reading-input" className="text-xs font-bold text-slate-700">
                Current Meter Reading (kWh) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                How to read meter
              </button>
            </div>
            <div className="relative">
              <input
                id="meter-reading-input"
                type="number"
                step="any"
                inputMode="decimal"
                required
                placeholder={hasPrevious ? `e.g. ${(previousValue + 25.5).toFixed(1)}` : 'e.g. 2150.0'}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 font-mono-num placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                kWh
              </span>
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          {isValidNum && hasPrevious && numCurrent >= previousValue && (
            <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-emerald-800">Consumption this period</span>
                <span className="text-xs font-bold text-slate-900 font-mono-num">
                  +{formatKwh(liveConsumption)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-emerald-200">
                <span className="text-xs text-slate-600">Estimated cost @ {formatCurrency(settings.electricityRate || 0)}/kWh</span>
                <span className="text-sm font-black text-emerald-700 font-mono-num">
                  {formatCurrency(liveCost, settings.currency)}
                </span>
              </div>
            </div>
          )}

          {/* Reading Date */}
          <div>
            <label htmlFor="meter-date-input" className="text-xs font-bold text-slate-700 block mb-1.5">
              Reading Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="meter-date-input"
                type="date"
                required
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="meter-notes-input" className="text-xs font-bold text-slate-700 block mb-1.5">
              Notes / Tags <span className="text-[11px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="meter-notes-input"
              type="text"
              placeholder="e.g. End of month check, AC heavy usage week"
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
              id="save-meter-reading-btn"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-white" />
              {isEditing ? 'Save Changes' : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
