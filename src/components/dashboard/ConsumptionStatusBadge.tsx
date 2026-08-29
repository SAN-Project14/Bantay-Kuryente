import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, ShieldCheck } from 'lucide-react';
import { ConsumptionStatusType } from '../../types';

interface ConsumptionStatusBadgeProps {
  status: ConsumptionStatusType;
  message?: string;
  hasEnoughHistory?: boolean;
}

export const ConsumptionStatusBadge: React.FC<ConsumptionStatusBadgeProps> = ({
  status,
  message,
  hasEnoughHistory = true,
}) => {
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let iconContainer = 'text-emerald-600 bg-emerald-100/60';
  let title = 'NORMAL PACE';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  let cardBorder = 'border-slate-200/90';

  if (status === 'WATCH') {
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    iconContainer = 'text-amber-600 bg-amber-100/60';
    title = 'WATCH USAGE';
    icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
    cardBorder = 'border-amber-200/80';
  } else if (status === 'HIGH') {
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    iconContainer = 'text-rose-600 bg-rose-100/60';
    title = 'HIGH USAGE ALERT';
    icon = <AlertOctagon className="w-4 h-4 text-rose-600" />;
    cardBorder = 'border-rose-200/80';
  }

  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-2xl border ${cardBorder} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all`}
    >
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${badgeBg}`}
        >
          {icon}
          <span>{title}</span>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            {message || 'Consumption is running within normal parameters.'}
          </p>
          {!hasEnoughHistory && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              Still recording readings to establish your baseline pattern.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

