import React, { useState } from 'react';
import { Plus, Zap, Filter, Sparkles, AlertCircle, Layers } from 'lucide-react';
import { PRESET_APPLIANCES } from '../../data/presetAppliances';
import { Appliance, ApplianceCategory, PresetApplianceItem, UserSettings } from '../../types';
import { calculateApplianceStats, formatCurrency, formatKwh } from '../../utils/calculations';
import { ApplianceCard } from './ApplianceCard';
import { ApplianceUsageSimulator } from './ApplianceUsageSimulator';

interface AppliancesViewProps {
  appliances: Appliance[];
  settings: UserSettings;
  onAddAppliance: (preset?: PresetApplianceItem) => void;
  onEditAppliance: (appliance: Appliance) => void;
  onDeleteAppliance: (appliance: Appliance) => void;
}

export const AppliancesView: React.FC<AppliancesViewProps> = ({
  appliances,
  settings,
  onAddAppliance,
  onEditAppliance,
  onDeleteAppliance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const rate = settings.electricityRate || 0;

  // Compute stats for all appliances
  const listWithStats = appliances.map((app) => ({
    app,
    stats: calculateApplianceStats(app, rate),
  }));

  // Sort descending by monthly kWh to determine ranking
  listWithStats.sort((a, b) => b.stats.monthlyKwh - a.stats.monthlyKwh);

  const totalMonthlyKwh = listWithStats.reduce((sum, i) => sum + i.stats.monthlyKwh, 0);
  const totalMonthlyCost = listWithStats.reduce((sum, i) => sum + i.stats.monthlyCost, 0);

  const categories = ['ALL', ...Array.from(new Set(appliances.map((a) => a.category)))];

  const filteredList =
    selectedCategory === 'ALL'
      ? listWithStats
      : listWithStats.filter((item) => item.app.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Appliance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Estimate appliance electricity consumption and identify top power users
          </p>
        </div>

        <button
          type="button"
          id="add-appliance-main-btn"
          onClick={() => onAddAppliance()}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Appliance</span>
        </button>
      </div>

      {/* Overview Totals Card */}
      {appliances.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Tracked Appliances
            </span>
            <div className="text-2xl font-black font-mono-num text-slate-900 mt-1.5">
              {appliances.length} <span className="text-sm font-sans font-medium text-slate-400">items</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Inverter & standard home loads
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Est. Total Appliance Load
            </span>
            <div className="text-2xl font-black font-mono-num text-slate-900 mt-1.5">
              ~{totalMonthlyKwh.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-400">kWh/mo</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Calculated from nominal ratings & duty cycles
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Est. Monthly Appliance Cost
            </span>
            <div className="text-2xl font-black font-mono-num text-emerald-600 mt-1.5">
              {formatCurrency(totalMonthlyCost, settings.currency)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              @ {formatCurrency(rate, settings.currency)}/kWh
            </span>
          </div>
        </div>
      )}

      {/* Interactive Saving Simulator */}
      {appliances.length > 0 && (
        <ApplianceUsageSimulator appliances={appliances} settings={settings} />
      )}

      {/* Quick Add Preset Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick Add Popular Filipino Appliances</span>
        </span>
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {PRESET_APPLIANCES.slice(0, 8).map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onAddAppliance(preset)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 shadow-2xs hover:border-slate-300"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>{preset.name.split(' (')[0]}</span>
              <span className="text-[11px] text-slate-500 font-mono-num font-normal">({preset.defaultWatts}W)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      {appliances.length > 0 && categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Appliance Cards Grid */}
      {appliances.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No appliances added yet</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Add your air conditioner, refrigerator, electric fans, rice cooker, and television to see an estimated breakdown of your biggest power consumers.
          </p>
          <button
            type="button"
            onClick={() => onAddAppliance()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            Add First Appliance
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item, index) => (
            <ApplianceCard
              key={item.app.id}
              appliance={item.app}
              rank={listWithStats.findIndex((x) => x.app.id === item.app.id) + 1}
              totalApplianceKwh={totalMonthlyKwh}
              settings={settings}
              onEdit={onEditAppliance}
              onDelete={onDeleteAppliance}
            />
          ))}
        </div>
      )}

      {/* Disclaimers & Notes */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800">Note:</strong> Appliance calculations are estimated approximations based on nominal ratings and operating hours. Actual power consumption may vary based on inverter cycling, ambient temperature, appliance age, and compressor duty cycles.
      </div>
    </div>
  );
};

