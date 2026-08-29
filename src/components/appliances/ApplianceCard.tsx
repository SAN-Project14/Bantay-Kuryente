import React from 'react';
import { Edit3, Trash2, Zap, Clock, Calendar, Sparkles } from 'lucide-react';
import { Appliance, UserSettings } from '../../types';
import { calculateApplianceStats, formatCurrency } from '../../utils/calculations';

interface ApplianceCardProps {
  appliance: Appliance;
  rank: number;
  totalApplianceKwh: number;
  settings: UserSettings;
  onEdit: (appliance: Appliance) => void;
  onDelete: (appliance: Appliance) => void;
}

export const ApplianceCard: React.FC<ApplianceCardProps> = ({
  appliance,
  rank,
  totalApplianceKwh,
  settings,
  onEdit,
  onDelete,
}) => {
  const stats = calculateApplianceStats(appliance, settings.electricityRate || 0);
  const sharePercent = totalApplianceKwh > 0 ? Math.round((stats.monthlyKwh / totalApplianceKwh) * 100) : 0;
  const count = appliance.quantity || 1;

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:border-slate-300 hover:shadow-sm">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono-num font-bold text-xs text-slate-700 flex-shrink-0 mt-0.5">
            #{rank}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 truncate">{appliance.name}</h4>
              {count > 1 && (
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  ×{count}
                </span>
              )}
              {appliance.isInverter && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Inverter
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium">{appliance.category}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(appliance)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            title="Edit appliance"
            aria-label="Edit appliance"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(appliance)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            title="Delete appliance"
            aria-label="Delete appliance"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-3 gap-2 py-2.5 bg-slate-50 rounded-xl px-3 border border-slate-200/80 text-center">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Power</span>
          <span className="text-xs font-bold font-mono-num text-slate-900">{appliance.watts}W</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Daily Use</span>
          <span className="text-xs font-bold font-mono-num text-slate-900">{appliance.hoursPerDay}h/day</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Frequency</span>
          <span className="text-xs font-bold font-mono-num text-slate-900">{appliance.daysPerWeek}d/wk</span>
        </div>
      </div>

      {/* Estimated Output */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <div>
          <span className="text-xs text-slate-500 block">Est. Consumption</span>
          <span className="font-extrabold text-sm sm:text-base font-mono-num text-slate-900">
            ~{stats.monthlyKwh} <span className="text-xs font-normal text-slate-500 font-sans">kWh/mo</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Est. Monthly Cost</span>
          <span className="font-black text-sm sm:text-base font-mono-num text-emerald-600">
            {formatCurrency(stats.monthlyCost, settings.currency)}
          </span>
        </div>
      </div>

      {/* Optional Note / Tip */}
      {appliance.notes && (
        <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 italic flex items-center gap-1.5">
          <span className="text-amber-600 not-italic">💡</span> {appliance.notes}
        </p>
      )}
    </div>
  );
};

