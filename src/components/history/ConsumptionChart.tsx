import React, { useState } from 'react';
import { MeterReading, UserSettings } from '../../types';
import { formatCurrency, formatDate, formatKwh, sortReadings } from '../../utils/calculations';

interface ConsumptionChartProps {
  readings: MeterReading[];
  settings: UserSettings;
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ readings, settings }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Need sorted ascending for chronological chart
  const chronReadings = sortReadings(readings, 'asc');

  // Filter only readings that have calculated consumption (> 0 or index > 0)
  const chartData = chronReadings.filter((r, idx) => idx > 0 && r.consumption !== undefined);

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-center p-6">
        <p className="text-xs font-semibold text-slate-700">
          Need at least 2 meter readings to render a consumption timeline.
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Add your next meter check to see your consumption trends.
        </p>
      </div>
    );
  }

  // Calculate max consumption for scaling
  const maxKwh = Math.max(...chartData.map((d) => d.consumption || 0), 10);
  const rate = settings.electricityRate || 0;

  return (
    <div className="w-full space-y-3">
      {/* Chart Canvas Container */}
      <div className="w-full bg-slate-50/80 p-5 rounded-2xl border border-slate-200 relative overflow-hidden">
        {/* Subtle grid lines */}
        <div className="absolute inset-x-5 top-5 bottom-8 flex flex-col justify-between pointer-events-none opacity-50">
          <div className="border-b border-slate-200/80 w-full"></div>
          <div className="border-b border-slate-200/80 w-full"></div>
          <div className="border-b border-slate-200/80 w-full"></div>
        </div>

        {/* Bars Grid */}
        <div className="relative z-10 flex items-end justify-around gap-3 h-44 pt-5 pb-1">
          {chartData.map((item, index) => {
            const kwh = item.consumption || 0;
            const heightPercent = Math.min(100, Math.max(10, (kwh / (maxKwh * 1.15)) * 100));
            const isHovered = hoveredIndex === index;
            const cost = kwh * rate;

            return (
              <div
                key={item.id}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer max-w-[64px]"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(index)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-lg z-30 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                    <div className="font-extrabold font-mono-num">{formatKwh(kwh)}</div>
                    <div className="text-slate-300 text-[11px] font-medium mt-0.5">
                      {formatCurrency(cost, settings.currency)} • {formatDate(item.date)}
                    </div>
                  </div>
                )}

                {/* Top value indicator */}
                <span className="text-[10px] font-mono-num font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {kwh.toFixed(1)}
                </span>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    isHovered
                      ? 'bg-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Date Label */}
                <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                  {formatDate(item.date, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
        <span>Bar height represents kWh consumption between recordings</span>
        <span className="font-bold text-slate-800">Max: {maxKwh.toFixed(1)} kWh</span>
      </div>
    </div>
  );
};

