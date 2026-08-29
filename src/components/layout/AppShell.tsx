import React from 'react';
import { Home, History, Zap, Settings, Plus, ShieldCheck } from 'lucide-react';
import { UserSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';

export type ActiveTabType = 'dashboard' | 'history' | 'appliances' | 'settings';

interface AppShellProps {
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  onAddReading: () => void;
  settings: UserSettings;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  onAddReading,
  settings,
  children,
}) => {
  const navItems: { id: ActiveTabType; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', mobileLabel: 'Home', icon: <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'history', label: 'History', mobileLabel: 'History', icon: <History className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'appliances', label: 'Appliances', mobileLabel: 'Appliances', icon: <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'settings', label: 'Settings', mobileLabel: 'Settings', icon: <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-100 selection:text-amber-900 antialiased overflow-x-hidden">
      {/* Top Application Header */}
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
        }}
      >
        <div className="max-w-6xl w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Mark & Title */}
          <button
            type="button"
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl p-1 -ml-1 transition-transform active:scale-[0.99]"
            onClick={() => onTabChange('dashboard')}
            aria-label="Go to Home Dashboard"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-xs flex-shrink-0">
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="#F59E0B"
                  stroke="#D97706"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase">
                  Bantay-Kuryente
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span>Offline</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block font-medium leading-none mt-0.5">
                Household Electricity & Meter Tracker
              </p>
            </div>
          </button>

          {/* Desktop & Tablet Top Navigation Bar (Hidden on Mobile) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={
                      isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
                    }
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions (Tablet / Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {settings.electricityRate > 0 && (
              <div className="text-right px-3 py-1 bg-slate-100/80 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
                  Rate
                </span>
                <span className="font-bold font-mono-num text-xs text-slate-800">
                  {formatCurrency(settings.electricityRate, settings.currency)}/kWh
                </span>
              </div>
            )}
            <button
              type="button"
              id="top-record-btn"
              onClick={onAddReading}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              aria-label="Record Electric Meter Reading"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" aria-hidden="true" />
              <span>Record Meter</span>
            </button>
          </div>

          {/* Mobile Right Action */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              type="button"
              id="mobile-header-record-btn"
              onClick={onAddReading}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-1 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Record Meter Reading"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Record</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Content Area */}
      <main
        className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 transition-all"
        style={{
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Hidden on md: breakpoint and above) */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
        style={{
          paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0px))',
        }}
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto pt-1.5 pb-1 px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 select-none ${
                  isActive
                    ? 'text-slate-900 font-bold bg-slate-100/90'
                    : 'text-slate-500 hover:text-slate-900 font-medium active:bg-slate-50'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform duration-150 ${
                    isActive ? 'text-amber-600 scale-105' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <span className="text-[11px] leading-tight tracking-tight mt-0.5 truncate max-w-full">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
