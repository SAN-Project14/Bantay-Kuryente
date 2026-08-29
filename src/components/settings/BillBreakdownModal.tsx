import React from 'react';
import { X, FileText, PieChart, ShieldAlert } from 'lucide-react';

interface BillBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillBreakdownModal: React.FC<BillBreakdownModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="bill-breakdown-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="bill-breakdown-content"
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bill-breakdown-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="bill-breakdown-title" className="text-base font-bold text-slate-900">
                Understanding Your Electric Bill
              </h2>
              <p className="text-xs text-slate-500">What makes up your monthly electricity charges?</p>
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

        <div className="mt-4 space-y-3 overflow-y-auto pr-1 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">
              1. Generation Charge (~50% – 60%)
            </h4>
            <p className="leading-relaxed">
              Cost of producing electricity bought from power generation plants (coal, natural gas, hydro, solar, geothermal). This fluctuates monthly depending on fuel prices and currency exchange.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">
              2. Transmission Charge (~8% – 10%)
            </h4>
            <p className="leading-relaxed">
              Cost of transporting high-voltage electricity across the national grid (NGCP) from power plants to your local distribution utility.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">
              3. Distribution Charge (~18% – 22%)
            </h4>
            <p className="leading-relaxed">
              The fee paid to your distribution utility (e.g. Meralco, VECO, Davao Light, local electric coop) for maintaining poles, wires, transformers, and customer service.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">
              4. System Loss Charge (~5% – 7%)
            </h4>
            <p className="leading-relaxed">
              Cost of technical electrical loss in wires and non-technical loss (pilferage/illegal connections) regulated by the Energy Regulatory Commission (ERC).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">
              5. Taxes & Universal Charges (~10% – 12%)
            </h4>
            <p className="leading-relaxed">
              Includes 12% Value Added Tax (VAT), local franchise tax, missionary electrification subsidy for off-grid islands, and environmental charges.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
