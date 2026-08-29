import React from 'react';
import { Gauge, Plus, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { UserSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface EmptyDashboardStateProps {
  settings: UserSettings;
  onAddReading: () => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({
  settings,
  onAddReading,
  onLoadSample,
  onOpenGuide,
}) => {
  return (
    <div className="py-8 sm:py-12 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
      {/* Icon Badge with glowing effect */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-md shadow-slate-200/50">
        <Gauge className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
        Take Control of Your Electricity Bill
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto mb-8">
        Record your electric meter reading and rate to start estimating your consumption, forecasting your upcoming bill, and managing your monthly budget with precision.
      </p>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 max-w-md mx-auto">
        <button
          type="button"
          id="empty-add-first-reading-btn"
          onClick={onAddReading}
          className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Record First Meter Reading</span>
        </button>

        <button
          type="button"
          id="empty-load-sample-btn"
          onClick={onLoadSample}
          className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-800 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Try Demo Data</span>
        </button>
      </div>

      {/* 3 Step Visual Explainer */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 text-left shadow-xs mb-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            How Bantay Kuryente Works
          </h3>
          <button
            type="button"
            onClick={onOpenGuide}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Reading Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">
              1
            </span>
            <h4 className="text-sm font-bold text-slate-900 pt-0.5">Record Reading</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter the cumulative numbers displayed on your electric meter display or dials.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">
              2
            </span>
            <h4 className="text-sm font-bold text-slate-900 pt-0.5">Instant Delta</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kilowatt-hours (kWh) and peso costs are calculated automatically against your rate.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">
              3
            </span>
            <h4 className="text-sm font-bold text-slate-900 pt-0.5">No Surprise Bills</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive smart pace alerts, budget status, and appliance insights before your bill arrives.
            </p>
          </div>
        </div>
      </div>

      {/* Offline Guarantee note */}
      <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200/80">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Offline-First. All your recordings stay completely private on your device.</span>
      </div>
    </div>
  );
};
