import React, { useState } from 'react';
import { X, Gauge, Zap, HelpCircle, Check, ArrowRight } from 'lucide-react';

interface MeterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeterGuideModal: React.FC<MeterGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'digital' | 'analog' | 'submeter'>('digital');

  if (!isOpen) return null;

  return (
    <div
      id="meter-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="meter-guide-content"
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="meter-guide-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 id="meter-guide-title" className="text-base font-bold text-slate-900">
                How to Read Your Electric Meter
              </h2>
              <p className="text-xs text-slate-500">Quick visual guide for Philippine residential meters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meter Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl my-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('digital')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'digital'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Digital LCD Meter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analog')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'analog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Analog Dial Meter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submeter')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'submeter'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Sub-Meter / Renters
          </button>
        </div>

        {/* Guide Content */}
        <div className="overflow-y-auto pr-1 space-y-4 text-sm text-slate-700">
          {activeTab === 'digital' && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="text-emerald-400 font-mono-num text-3xl font-bold tracking-widest mb-1">
                  02855.2 <span className="text-xs text-slate-400 tracking-normal font-sans">kWh</span>
                </div>
                <p className="text-xs text-slate-400">Modern Meralco / Electric Cooperative Smart LCD Meter</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Read the main LCD display:</strong> The screen continuously displays your total cumulative kilowatt-hours (kWh).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Record the numbers:</strong> Enter all digits displayed on the screen. Decimals (if shown after a dot) can also be entered.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Automatic delta calculation:</strong> Bantay Kuryente automatically subtracts your previous reading to give your exact consumption in kWh.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analog' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 my-1">
                  {[2, 8, 5, 5].map((num, i) => (
                    <div key={i} className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative font-mono-num font-bold text-sm text-slate-900">
                        {num}
                        <div className="absolute w-1 h-3 bg-rose-500 top-1 rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 mt-1">Dial {i + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Read left to right (10,000 → 1,000 → 100 → 10 → 1)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Read left to right:</strong> Start with the leftmost dial (highest value) and move rightward.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Always choose the lower number:</strong> If the pointer is between two numbers (e.g. between 4 and 5), always record the smaller number (4). If between 9 and 0, record 9.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Alternating dial directions:</strong> Notice that adjacent dials turn in opposite directions (clockwise, then counter-clockwise). This is normal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submeter' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>For Boarding Houses & Apartments:</strong> Sub-meters are installed by landlords to track individual room or unit consumption from the master utility line.
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Check the sub-meter type:</strong> Most sub-meters are compact digital LCDs or 5-digit mechanical odometers.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Red or decimal numbers:</strong> Some sub-meters have a red last digit which represents tenths (0.1 kWh). E.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono-num">0145.6</code> is 145.6 kWh.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Set landlord's agreed rate:</strong> In Settings, set the per-kWh rate agreed with your landlord (e.g. ₱12.00–₱15.00/kWh) to get exact room bill estimates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
