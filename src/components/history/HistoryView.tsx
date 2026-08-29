import React, { useState } from 'react';
import {
  History,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { BillingCycleStats, MeterReading, UserSettings } from '../../types';
import { formatCurrency, formatKwh, sortReadings } from '../../utils/calculations';
import { ConsumptionChart } from './ConsumptionChart';
import { ReadingListItem } from './ReadingListItem';

interface HistoryViewProps {
  readings: MeterReading[];
  stats: BillingCycleStats;
  settings: UserSettings;
  onAddReading: () => void;
  onEditReading: (reading: MeterReading) => void;
  onDeleteReading: (reading: MeterReading) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  readings,
  stats,
  settings,
  onAddReading,
  onEditReading,
  onDeleteReading,
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const sorted = sortReadings(readings, sortOrder);

  // Total recorded consumption across all recorded readings
  const totalTrackedKwh = readings.reduce((sum, r) => sum + (r.consumption || 0), 0);
  const totalTrackedCost = totalTrackedKwh * (settings.electricityRate || 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Meter Reading History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track historical meter recordings, consumption trends, and changes over time
          </p>
        </div>

        <button
          type="button"
          onClick={onAddReading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Record Reading</span>
        </button>
      </div>

      {/* Consumption Timeline & Chart Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Consumption Trend
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {readings.length} {readings.length === 1 ? 'entry' : 'entries'} recorded
          </span>
        </div>

        <ConsumptionChart readings={readings} settings={settings} />
      </div>

      {/* "What Changed?" Period Comparison Insight */}
      {stats.historicalComparison && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${stats.historicalComparison.percentChange > 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
              {stats.historicalComparison.percentChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              What Changed vs Previous Period
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              Your electricity consumption is{' '}
              <strong className={stats.historicalComparison.percentChange > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                {Math.abs(stats.historicalComparison.percentChange)}%{' '}
                {stats.historicalComparison.percentChange > 0 ? 'higher' : 'lower'}
              </strong>{' '}
              than your previous period average.
            </p>
            <div className="bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono-num font-bold text-slate-700 flex-shrink-0">
              {stats.historicalComparison.percentChange > 0 ? '+' : ''}
              {stats.historicalComparison.differenceKwh} kWh (
              {formatCurrency(stats.historicalComparison.differenceCost, settings.currency)})
            </div>
          </div>
        </div>
      )}

      {/* Reading Logs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Recorded Readings ({readings.length})
          </h3>
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}</span>
          </button>
        </div>

        {readings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <History className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No readings logged yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first meter reading to start recording and building your consumption timeline.
            </p>
            <button
              type="button"
              onClick={onAddReading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-xs"
            >
              Add Baseline Reading
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item, index) => (
              <ReadingListItem
                key={item.id}
                reading={item}
                isFirst={sortOrder === 'desc' ? index === 0 : index === sorted.length - 1}
                settings={settings}
                onEdit={onEditReading}
                onDelete={onDeleteReading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

