import React from 'react';
import { Gauge, Calculator, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div
      id="bantay-welcome-screen"
      className="min-h-screen min-h-[100dvh] bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900"
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(1rem + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(1rem + env(safe-area-inset-right, 0px))',
      }}
    >
      {/* Top Header / Brand Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="text-xs font-extrabold tracking-wider text-slate-900 uppercase">
            Bantay-Kuryente
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-full border border-slate-300/60">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Offline Private</span>
        </div>
      </header>

      {/* Center Main Content Container */}
      <main className="max-w-md w-full mx-auto my-auto py-6 sm:py-8 flex flex-col items-center text-center">
        {/* Visual Brand Mark */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
            <Gauge className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />
          </div>
        </div>

        {/* Headline */}
        <h1
          id="welcome-headline"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3"
        >
          Know your electricity bill before it arrives.
        </h1>

        {/* Supporting text */}
        <p
          id="welcome-subtext"
          className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mb-8"
        >
          Track your household's electricity consumption, estimate your bill, and understand where your energy is going.
        </p>

        {/* Core Pillars / Value Points */}
        <div className="w-full space-y-3 text-left mb-8">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700 mt-0.5">
              <Gauge className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Record Electric Meter Dials</h2>
              <p className="text-xs text-slate-500 leading-normal mt-0.5">
                Log your starting and regular meter checks to compute exact kWh consumption.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-700 mt-0.5">
              <Calculator className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Real-Time Peso Bill Forecast</h2>
              <p className="text-xs text-slate-500 leading-normal mt-0.5">
                Calculate estimated costs and monitor your budget progress throughout the cycle.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700 mt-0.5">
              <Zap className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Track Household Appliances</h2>
              <p className="text-xs text-slate-500 leading-normal mt-0.5">
                Estimate individual appliance wattage, usage hours, and monthly costs.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Actions Section */}
      <footer className="max-w-md w-full mx-auto flex flex-col items-center gap-3">
        {/* Primary Action Button */}
        <button
          type="button"
          id="welcome-get-started-btn"
          onClick={onGetStarted}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-sm sm:text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Secondary Privacy Reassurance */}
        <div className="flex items-center gap-1.5 text-center text-xs text-slate-500 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>No account required. Your data stays on this device.</span>
        </div>
      </footer>
    </div>
  );
};
