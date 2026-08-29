import React from 'react';
import { Home, History, Zap, Settings, Plus, Gauge, Sparkles, HelpCircle } from 'lucide-react';
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
  const navItems: { id: ActiveTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'history', label: 'Readings & History', icon: <History className="w-4 h-4" /> },
    { id: 'appliances', label: 'Appliance Tracker', icon: <Zap className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Guides', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-700">
      {/* Top Application Header with safe area padding for notch/status-bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs pt-safe">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Bantay Kuryente
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Offline-First
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Know your electricity bill before it arrives
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Quick Actions Toolbar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Current Rate
              </span>
              <span className="font-bold font-mono-num text-xs text-slate-800">
                {formatCurrency(settings.electricityRate, settings.currency)}/kWh
              </span>
            </div>
            <button
              type="button"
              id="top-record-btn"
              onClick={onAddReading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Record Meter</span>
            </button>
          </div>

          {/* Mobile Right Action */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onAddReading}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Record</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with generous padding, safe bottom clearance & max width */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 safe-bottom-offset md:pb-12">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar with safe area bottom padding */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 pt-2 pb-safe shadow-lg"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] ${
                  isActive
                    ? 'text-blue-600 font-bold bg-blue-50/60'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
