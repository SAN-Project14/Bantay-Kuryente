import React from 'react';

interface MetricCardProps {
  id?: string;
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'standard' | 'highlight' | 'emerald' | 'amber';
  trend?: {
    value: string;
    isPositive?: boolean; // true if good/reduction, false if increase
    label?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  subValue,
  icon,
  variant = 'standard',
  trend,
}) => {
  let iconContainer = 'bg-slate-100 text-slate-600 border border-slate-200/80';
  let borderStyle = 'border-slate-200/80';

  if (variant === 'primary') {
    iconContainer = 'bg-blue-50 text-blue-600 border border-blue-100';
    borderStyle = 'border-blue-200/70 shadow-xs';
  } else if (variant === 'emerald') {
    iconContainer = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
  } else if (variant === 'amber') {
    iconContainer = 'bg-amber-50 text-amber-600 border border-amber-100';
  }

  return (
    <div
      id={id}
      className={`bg-white p-5 sm:p-6 rounded-2xl border ${borderStyle} shadow-xs hover:shadow-sm transition-all flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            {label}
          </span>
          {icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconContainer}`}>
              {icon}
            </div>
          )}
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-slate-900 tracking-tight break-words">
            {value}
          </div>
          {subValue && (
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              {subValue}
            </p>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold font-mono-num ${
              trend.isPositive ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {trend.value}
          </span>
          {trend.label && <span className="text-slate-400 text-[11px]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

