import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BillingCycleStats, UserSettings } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface BudgetProgressCardProps {
  stats: BillingCycleStats;
  settings: UserSettings;
  onEditBudget: () => void;
}

export const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  stats,
  settings,
  onEditBudget,
}) => {
  const budget = settings.monthlyBudget || 0;
  const currentCost = stats.currentEstimatedCost;
  const projectedCost = stats.projectedMonthlyCost;
  const percentUsed = budget > 0 ? Math.min(100, Math.round((currentCost / budget) * 100)) : 0;
  const isOverBudget = budget > 0 && projectedCost > budget;
  const variance = stats.budgetVariance;

  // Determine progress bar and status styling
  let barColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusLabel = 'Within Budget';

  if (budget <= 0) {
    barColor = 'bg-slate-300';
    badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
    statusLabel = 'No Limit Set';
  } else if (percentUsed > 85 || isOverBudget) {
    if (isOverBudget) {
      barColor = 'bg-rose-500';
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
      statusLabel = 'Exceeding Forecast';
    } else {
      barColor = 'bg-amber-500';
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
      statusLabel = 'Watch Pace';
    }
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Monthly Budget Target
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={onEditBudget}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {budget <= 0 ? 'Set Limit' : 'Adjust'}
          </button>
        </div>
      </div>

      {/* Main Budget Numbers */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono-num text-slate-900">
            {formatCurrency(currentCost, settings.currency)}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-400 font-mono-num">
            spent / {formatCurrency(budget, settings.currency)} limit
          </span>
        </div>
        <span className="text-xs font-bold font-mono-num text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/80">
          {percentUsed}% spent
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {/* Budget Forecast & Status Text */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          {budget <= 0 ? (
            <>
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">
                Set a monthly budget limit to monitor pace & alerts
              </span>
            </>
          ) : isOverBudget ? (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="text-rose-700 font-semibold">
                Projected to exceed budget by {formatCurrency(variance, settings.currency)}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-700 font-semibold">
                Projected to stay {formatCurrency(Math.abs(variance), settings.currency)} below target
              </span>
            </>
          )}
        </div>

        <span className="text-[11px] font-mono-num font-semibold text-slate-500">
          Forecasted: {formatCurrency(projectedCost, settings.currency)}
        </span>
      </div>
    </div>
  );
};

