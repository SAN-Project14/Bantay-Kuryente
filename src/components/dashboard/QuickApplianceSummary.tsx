import React from 'react';
import { Zap, ArrowRight, Plus } from 'lucide-react';
import { Appliance, UserSettings } from '../../types';
import { calculateApplianceStats, formatCurrency, formatKwh } from '../../utils/calculations';

interface QuickApplianceSummaryProps {
  appliances: Appliance[];
  settings: UserSettings;
  onNavigateToAppliances: () => void;
  onAddAppliance: () => void;
}

export const QuickApplianceSummary: React.FC<QuickApplianceSummaryProps> = ({
  appliances,
  settings,
  onNavigateToAppliances,
  onAddAppliance,
}) => {
  if (!appliances || appliances.length === 0) {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Track Your Household Appliances
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Estimate power consumption for air conditioning, refrigerators, fans, and electronics.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddAppliance}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs flex-shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Appliance</span>
        </button>
      </div>
    );
  }

  // Calculate monthly stats for all appliances
  const rate = settings.electricityRate || 0;
  const listWithStats = appliances.map((app) => ({
    app,
    stats: calculateApplianceStats(app, rate),
  }));

  // Sort descending by monthly kWh
  listWithStats.sort((a, b) => b.stats.monthlyKwh - a.stats.monthlyKwh);

  const topThree = listWithStats.slice(0, 3);
  const totalMonthlyKwh = listWithStats.reduce((sum, item) => sum + item.stats.monthlyKwh, 0);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Top Estimated Power Users
          </h3>
        </div>
        <button
          type="button"
          onClick={onNavigateToAppliances}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>View All ({appliances.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {topThree.map((item, index) => {
          const sharePercent =
            totalMonthlyKwh > 0 ? Math.round((item.stats.monthlyKwh / totalMonthlyKwh) * 100) : 0;

          return (
            <div
              key={item.app.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center font-mono-num font-bold text-xs text-slate-600 flex-shrink-0">
                  {index + 1}
                </span>
                <div className="truncate">
                  <span className="font-bold text-slate-900 block truncate text-xs sm:text-sm">
                    {item.app.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.app.watts}W • {item.app.hoursPerDay}h/day • {sharePercent}% of total load
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-bold text-slate-900 font-mono-num block text-xs sm:text-sm">
                  ~{item.stats.monthlyKwh} kWh
                </span>
                <span className="text-[11px] font-semibold text-slate-500 font-mono-num">
                  {formatCurrency(item.stats.monthlyCost, settings.currency)}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

