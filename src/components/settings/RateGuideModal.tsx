import React from 'react';
import { X, HelpCircle, Calculator, Check, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface RateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRate: (rate: number) => void;
}

export const RateGuideModal: React.FC<RateGuideModalProps> = ({
  isOpen,
  onClose,
  onApplyRate,
}) => {
  const [totalBill, setTotalBill] = React.useState<string>('3200');
  const [totalKwh, setTotalKwh] = React.useState<string>('275');

  if (!isOpen) return null;

  const billNum = parseFloat(totalBill) || 0;
  const kwhNum = parseFloat(totalKwh) || 0;
  const calculatedRate = kwhNum > 0 ? Number((billNum / kwhNum).toFixed(2)) : 0;

  return (
    <div
      id="rate-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="rate-guide-content"
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rate-guide-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rate-guide-title" className="text-base font-bold text-slate-900">
                Calculate Effective Rate
              </h2>
              <p className="text-xs text-slate-500">
                Find your exact ₱/kWh from your latest electricity bill
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

        <div className="mt-4 space-y-4 overflow-y-auto pr-1 text-xs">
          <p className="text-slate-600 leading-relaxed">
            In the Philippines, electricity bills include generation, transmission, distribution, system loss, and taxes. The simplest and most accurate way to get your effective per-kWh rate is:
          </p>

          {/* Formula Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center font-mono-num font-bold text-xs sm:text-sm text-slate-900 shadow-2xs">
            Total Amount Due (₱) ÷ Total kWh Consumed = Effective Rate (₱/kWh)
          </div>

          {/* Mini Calculator */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Rate Finder
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Total Bill Amount (₱)
                </label>
                <input
                  type="number"
                  placeholder="3200"
                  value={totalBill}
                  onChange={(e) => setTotalBill(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono-num font-semibold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Total kWh on Bill
                </label>
                <input
                  type="number"
                  placeholder="275"
                  value={totalKwh}
                  onChange={(e) => setTotalKwh(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono-num font-semibold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {calculatedRate > 0 && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Your Effective Rate:</span>
                <span className="text-sm font-bold font-mono-num text-emerald-600">
                  ₱{calculatedRate.toFixed(2)} / kWh
                </span>
              </div>
            )}
          </div>

          {/* Typical PH Benchmarks */}
          <div className="space-y-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800 block">Typical Philippine Rate Ranges:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Metro Manila / Meralco: ~₱11.00 – ₱12.50 / kWh</li>
              <li>Visayas / Cebu (VECO): ~₱10.50 – ₱12.00 / kWh</li>
              <li>Mindanao / Davao Light: ~₱9.50 – ₱11.50 / kWh</li>
              <li>Provincial Electric Cooperatives: ~₱11.00 – ₱15.00 / kWh</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          {calculatedRate > 0 && (
            <button
              type="button"
              onClick={() => {
                onApplyRate(calculatedRate);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Apply ₱{calculatedRate.toFixed(2)}/kWh</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
