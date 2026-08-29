import React from 'react';
import { Calendar, Edit3, Trash2, Gauge, Zap, Tag } from 'lucide-react';
import { MeterReading, UserSettings } from '../../types';
import { formatCurrency, formatDate, formatKwh } from '../../utils/calculations';

interface ReadingListItemProps {
  reading: MeterReading;
  isFirst: boolean;
  settings: UserSettings;
  onEdit: (reading: MeterReading) => void;
  onDelete: (reading: MeterReading) => void;
}

export const ReadingListItem: React.FC<ReadingListItemProps> = ({
  reading,
  isFirst,
  settings,
  onEdit,
  onDelete,
}) => {
  const consumption = reading.consumption ?? 0;
  const rate = settings.electricityRate || 0;
  const estimatedCost = consumption * rate;
  const isBaseline = reading.previousReading === undefined || reading.previousReading === 0;

  return (
    <div className="p-4 sm:p-5 bg-white hover:bg-slate-50/70 rounded-2xl border border-slate-200 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left info: Date & Meter Reading */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Gauge className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold font-mono-num text-slate-900">
              {reading.reading.toLocaleString('en-PH', { minimumFractionDigits: 1 })}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">kWh</span>
            </span>
            {isFirst && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Latest
              </span>
            )}
            {isBaseline && (
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Baseline Reference
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(reading.date)}
            </span>
            {reading.notes && (
              <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                <Tag className="w-3 h-3 text-slate-400" />
                {reading.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right info: Calculated Delta & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        {!isBaseline ? (
          <div className="text-left sm:text-right">
            <span className="text-sm font-extrabold font-mono-num text-slate-900 block">
              +{formatKwh(consumption)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 font-mono-num block">
              ≈ {formatCurrency(estimatedCost, settings.currency)}
            </span>
          </div>
        ) : (
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 italic block font-medium">Starting Point</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(reading)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            title="Edit reading"
            aria-label="Edit reading"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(reading)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            title="Delete reading"
            aria-label="Delete reading"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

