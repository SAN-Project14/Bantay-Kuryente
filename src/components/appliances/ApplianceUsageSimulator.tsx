import React, { useState } from 'react';
import { Sparkles, Calculator, ArrowRight, CheckCircle2, TrendingDown } from 'lucide-react';
import { Appliance, UserSettings } from '../../types';
import { calculateApplianceStats, formatCurrency, formatKwh } from '../../utils/calculations';

interface ApplianceUsageSimulatorProps {
  appliances: Appliance[];
  settings: UserSettings;
}

export const ApplianceUsageSimulator: React.FC<ApplianceUsageSimulatorProps> = ({
  appliances,
  settings,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    appliances.length > 0 ? appliances[0].id : ''
  );
  const [hoursToReduce, setHoursToReduce] = useState<number>(1);

  if (appliances.length === 0) return null;

  const currentApp = appliances.find((a) => a.id === selectedAppId) || appliances[0];
  const rate = settings.electricityRate || 0;
  const count = currentApp.quantity || 1;

  // Calculate monthly kWh saved:
  // (Watts * Count * hoursToReduce * (daysPerWeek/7) * 30) / 1000
  const monthlyKwhSaved =
    (currentApp.watts * count * Math.min(hoursToReduce, currentApp.hoursPerDay) * (currentApp.daysPerWeek / 7) * 30) /
    1000;
  const monthlyCostSaved = monthlyKwhSaved * rate;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Interactive Saving Simulator
          </h3>
          <p className="text-xs text-slate-500">
            See estimated monthly peso savings by tweaking appliance habits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        {/* Select Appliance */}
        <div>
          <label htmlFor="sim-app-select" className="text-xs font-bold text-slate-700 block mb-1.5">
            Select Appliance
          </label>
          <select
            id="sim-app-select"
            value={currentApp.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {appliances.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name} ({app.watts}W, {app.hoursPerDay}h/day)
              </option>
            ))}
          </select>
        </div>

        {/* Adjust Hours */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="sim-hours" className="text-xs font-bold text-slate-700">
              Reduce usage by
            </label>
            <span className="text-xs font-bold font-mono-num text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {hoursToReduce} {hoursToReduce === 1 ? 'hour' : 'hours'}/day
            </span>
          </div>
          <input
            id="sim-hours"
            type="range"
            min="0.5"
            max={Math.max(1, currentApp.hoursPerDay)}
            step="0.5"
            value={hoursToReduce}
            onChange={(e) => setHoursToReduce(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
        </div>
      </div>

      {/* Result Callout */}
      <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-slate-800">
            Reducing <strong>{currentApp.name}</strong> by <strong>{hoursToReduce} hr/day</strong> saves approx.
          </div>
        </div>

        <div className="flex items-baseline gap-2 self-end sm:self-center flex-shrink-0">
          <span className="text-lg sm:text-xl font-black font-mono-num text-emerald-700">
            {formatCurrency(monthlyCostSaved, settings.currency)}
          </span>
          <span className="text-xs font-bold text-emerald-600 font-mono-num">
            (~{monthlyKwhSaved.toFixed(1)} kWh/mo)
          </span>
        </div>
      </div>
    </div>
  );
};

