import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { DynamicInsight } from '../../types';

interface DynamicInsightCardProps {
  insights: DynamicInsight[];
  onActionClick?: (view: 'meter' | 'appliances' | 'settings' | 'history') => void;
}

export const DynamicInsightCard: React.FC<DynamicInsightCardProps> = ({
  insights,
  onActionClick,
}) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Lightbulb className="w-4 h-4 text-amber-600" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Insights & Practical Recommendations
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {insights.map((item) => {
          let icon = <Lightbulb className="w-5 h-5 text-amber-600" />;
          let cardBg = 'bg-amber-50/70 border-amber-200/90';
          let titleColor = 'text-amber-900';
          let textColor = 'text-amber-800/90';
          let iconBg = 'bg-amber-100/80 border-amber-200';
          let btnStyle = 'bg-amber-700 hover:bg-amber-800 text-white';

          if (item.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-rose-600" />;
            cardBg = 'bg-rose-50/70 border-rose-200/90';
            titleColor = 'text-rose-900';
            textColor = 'text-rose-800/90';
            iconBg = 'bg-rose-100/80 border-rose-200';
            btnStyle = 'bg-rose-700 hover:bg-rose-800 text-white';
          } else if (item.type === 'positive') {
            icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
            cardBg = 'bg-emerald-50/70 border-emerald-200/90';
            titleColor = 'text-emerald-900';
            textColor = 'text-emerald-800/90';
            iconBg = 'bg-emerald-100/80 border-emerald-200';
            btnStyle = 'bg-emerald-700 hover:bg-emerald-800 text-white';
          }

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${cardBg} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border flex-shrink-0 shadow-2xs mt-0.5 ${iconBg}`}>
                  {icon}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${titleColor}`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${textColor}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {item.actionLabel && item.actionView && onActionClick && (
                <button
                  type="button"
                  onClick={() => onActionClick(item.actionView!)}
                  className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0 active:scale-[0.98] ${btnStyle}`}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

