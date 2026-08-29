import {
  Appliance,
  BillingCycleStats,
  ConsumptionStatusType,
  DynamicInsight,
  MeterReading,
  UserSettings,
} from '../types';

/**
 * Format a number into Philippine Peso representation
 */
export function formatCurrency(amount: number, currency: string = '₱'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currency}0.00`;
  }
  return `${currency}${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format kWh with clean single or double decimals
 */
export function formatKwh(kwh: number): string {
  if (isNaN(kwh) || kwh === null || kwh === undefined) {
    return '0.0 kWh';
  }
  return `${kwh.toLocaleString('en-PH', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kWh`;
}

/**
 * Format date for friendly Philippine display
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOpts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-PH', options || defaultOpts);
}

/**
 * Calculate consumption from two readings
 */
export function calculateConsumption(current: number, previous: number): number {
  const diff = current - previous;
  return diff >= 0 ? Number(diff.toFixed(2)) : 0;
}

/**
 * Calculate estimated cost given kWh and rate
 */
export function calculateEstimatedCost(kwh: number, rate: number): number {
  return Number((kwh * rate).toFixed(2));
}

/**
 * Calculate appliance daily and monthly kWh
 */
export function calculateApplianceStats(appliance: Appliance, electricityRate: number) {
  const { watts, hoursPerDay, daysPerWeek, quantity } = appliance;
  const count = quantity > 0 ? quantity : 1;
  
  // Daily average kWh
  const dailyKwh = (watts * count * hoursPerDay * (daysPerWeek / 7)) / 1000;
  // Standard monthly kWh (30 days)
  const monthlyKwh = dailyKwh * 30;
  // Estimated monthly cost in Peso
  const monthlyCost = monthlyKwh * electricityRate;
  
  return {
    dailyKwh: Number(dailyKwh.toFixed(2)),
    monthlyKwh: Number(monthlyKwh.toFixed(1)),
    monthlyCost: Number(monthlyCost.toFixed(2)),
  };
}

/**
 * Sort readings chronologically (oldest first or newest first)
 */
export function sortReadings(readings: MeterReading[], order: 'asc' | 'desc' = 'asc'): MeterReading[] {
  return [...readings].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (timeA === timeB) {
      return order === 'asc' ? a.reading - b.reading : b.reading - a.reading;
    }
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
}

/**
 * Recompute previous readings and consumption deltas in chronological order
 */
export function computeReadingDeltas(readings: MeterReading[]): MeterReading[] {
  const sorted = sortReadings(readings, 'asc');
  
  const computed = sorted.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        previousReading: undefined,
        consumption: 0,
      };
    }
    const prev = sorted[index - 1];
    const consumption = Math.max(0, Number((item.reading - prev.reading).toFixed(2)));
    return {
      ...item,
      previousReading: prev.reading,
      consumption,
    };
  });

  return sortReadings(computed, 'desc');
}

/**
 * Compute the current billing cycle date range
 */
export function getBillingCycleRange(cycleStartDay: number, referenceDate: Date = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const currentDay = referenceDate.getDate();

  let cycleStartDate: Date;
  let cycleEndDate: Date;

  if (currentDay >= cycleStartDay) {
    // Current cycle started this month
    cycleStartDate = new Date(year, month, cycleStartDay);
    cycleEndDate = new Date(year, month + 1, cycleStartDay - 1);
  } else {
    // Current cycle started last month
    cycleStartDate = new Date(year, month - 1, cycleStartDay);
    cycleEndDate = new Date(year, month, cycleStartDay - 1);
  }

  // Days in this billing cycle
  const totalCycleDays = Math.max(
    28,
    Math.round((cycleEndDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  // Days elapsed in current cycle so far
  const elapsedDays = Math.max(
    1,
    Math.min(
      totalCycleDays,
      Math.round((referenceDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  );

  const daysRemaining = Math.max(0, totalCycleDays - elapsedDays);

  return {
    cycleStartDate: cycleStartDate.toISOString().split('T')[0],
    cycleEndDate: cycleEndDate.toISOString().split('T')[0],
    totalCycleDays,
    elapsedDays,
    daysRemaining,
  };
}

/**
 * Calculate comprehensive billing and consumption statistics
 */
export function calculateBillingStats(
  readings: MeterReading[],
  settings: UserSettings
): BillingCycleStats {
  const rate = settings.electricityRate || 0;
  const budget = settings.monthlyBudget || 0;
  const cycleInfo = getBillingCycleRange(settings.billingCycleStartDay || 1);

  if (!readings || readings.length === 0) {
    return {
      hasReadings: false,
      totalReadingsCount: 0,
      currentPeriodConsumption: 0,
      currentEstimatedCost: 0,
      dailyAverageKwh: 0,
      projectedMonthlyKwh: 0,
      projectedMonthlyCost: 0,
      budgetRemaining: budget,
      budgetVariance: 0,
      budgetProgressPercent: 0,
      consumptionStatus: 'NORMAL',
      statusMessage: 'Add your first meter reading to start tracking.',
      daysInCurrentCycle: cycleInfo.elapsedDays,
      daysRemainingInCycle: cycleInfo.daysRemaining,
      cycleStartDate: cycleInfo.cycleStartDate,
      cycleEndDate: cycleInfo.cycleEndDate,
    };
  }

  const sortedDesc = sortReadings(readings, 'desc');
  const latestReading = sortedDesc[0];
  const previousReading = sortedDesc.length > 1 ? sortedDesc[1] : undefined;

  // If we only have 1 reading, we have a starting point but 0 tracked consumption yet
  if (sortedDesc.length === 1) {
    return {
      hasReadings: true,
      totalReadingsCount: 1,
      latestReading,
      currentPeriodConsumption: 0,
      currentEstimatedCost: 0,
      dailyAverageKwh: 0,
      projectedMonthlyKwh: 0,
      projectedMonthlyCost: 0,
      budgetRemaining: budget,
      budgetVariance: 0,
      budgetProgressPercent: 0,
      consumptionStatus: 'NORMAL',
      statusMessage: 'Baseline meter reading recorded. Add a second reading to calculate consumption.',
      daysInCurrentCycle: cycleInfo.elapsedDays,
      daysRemainingInCycle: cycleInfo.daysRemaining,
      cycleStartDate: cycleInfo.cycleStartDate,
      cycleEndDate: cycleInfo.cycleEndDate,
    };
  }

  // Calculate current period consumption
  // Find readings within or nearest the current billing cycle
  const currentCycleStart = new Date(cycleInfo.cycleStartDate).getTime();
  
  // Readings in current cycle
  const cycleReadings = sortedDesc.filter(
    (r) => new Date(r.date).getTime() >= currentCycleStart
  );

  let currentPeriodConsumption = 0;
  let daysSpan = 1;

  if (cycleReadings.length >= 2) {
    const oldestInCycle = cycleReadings[cycleReadings.length - 1];
    const newestInCycle = cycleReadings[0];
    currentPeriodConsumption = Math.max(0, newestInCycle.reading - oldestInCycle.reading);
    
    const d1 = new Date(oldestInCycle.date).getTime();
    const d2 = new Date(newestInCycle.date).getTime();
    daysSpan = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
  } else {
    // Fallback to the latest reading delta
    const latest = sortedDesc[0];
    const prev = sortedDesc[1];
    currentPeriodConsumption = Math.max(0, latest.reading - prev.reading);

    const d1 = new Date(prev.date).getTime();
    const d2 = new Date(latest.date).getTime();
    daysSpan = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
  }

  const currentEstimatedCost = Number((currentPeriodConsumption * rate).toFixed(2));

  // Daily average in kWh
  const dailyAverageKwh = Number((currentPeriodConsumption / daysSpan).toFixed(2));

  // Projected monthly consumption (based on total days in cycle, typically 30)
  const totalDays = cycleInfo.totalCycleDays || 30;
  const projectedMonthlyKwh = Number((dailyAverageKwh * totalDays).toFixed(1));
  const projectedMonthlyCost = Number((projectedMonthlyKwh * rate).toFixed(2));

  // Budget calculations
  const budgetRemaining = Number((budget - currentEstimatedCost).toFixed(2));
  const budgetVariance = Number((projectedMonthlyCost - budget).toFixed(2));
  const budgetProgressPercent = budget > 0 ? Math.min(100, Math.round((currentEstimatedCost / budget) * 100)) : 0;

  // Historical comparison if 3 or more readings exist
  let historicalComparison = undefined;
  if (sortedDesc.length >= 3) {
    const prevSpanLatest = sortedDesc[1];
    const prevSpanPrior = sortedDesc[2];
    const priorKwh = Math.max(0, prevSpanLatest.reading - prevSpanPrior.reading);
    const priorDays = Math.max(
      1,
      Math.round(
        (new Date(prevSpanLatest.date).getTime() - new Date(prevSpanPrior.date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const priorDaily = priorKwh / priorDays;
    
    if (priorDaily > 0) {
      const percentChange = Math.round(((dailyAverageKwh - priorDaily) / priorDaily) * 100);
      const differenceKwh = Number((currentPeriodConsumption - priorKwh).toFixed(1));
      const differenceCost = Number((differenceKwh * rate).toFixed(2));
      
      historicalComparison = {
        percentChange,
        differenceKwh,
        differenceCost,
        priorPeriodName: 'previous period',
      };
    }
  }

  // Determine Consumption Status: NORMAL | WATCH | HIGH
  let consumptionStatus: ConsumptionStatusType = 'NORMAL';
  let statusMessage = 'Your electricity consumption is within a typical range.';

  const isOverBudget = budget > 0 && projectedMonthlyCost > budget;
  const budgetExceedPercent = budget > 0 ? ((projectedMonthlyCost - budget) / budget) * 100 : 0;

  const historicalIncreasePercent = historicalComparison ? historicalComparison.percentChange : 0;

  if (historicalIncreasePercent > 25 || budgetExceedPercent > 20) {
    consumptionStatus = 'HIGH';
    statusMessage = historicalIncreasePercent > 25
      ? `Consumption is ${historicalIncreasePercent}% higher than previous average.`
      : `Projected bill exceeds monthly budget by ${formatCurrency(budgetVariance, settings.currency)}.`;
  } else if (historicalIncreasePercent > 10 || (isOverBudget && budgetExceedPercent > 0)) {
    consumptionStatus = 'WATCH';
    statusMessage = isOverBudget
      ? `Projected to slightly exceed budget by ${formatCurrency(budgetVariance, settings.currency)}.`
      : `Consumption is ${historicalIncreasePercent}% higher than previous period.`;
  } else if (budget > 0 && projectedMonthlyCost <= budget) {
    consumptionStatus = 'NORMAL';
    const underBudgetAmt = Math.abs(budgetVariance);
    statusMessage = underBudgetAmt > 0
      ? `On track to stay ${formatCurrency(underBudgetAmt, settings.currency)} below budget.`
      : 'Consumption is on track with your monthly target.';
  }

  return {
    hasReadings: true,
    totalReadingsCount: readings.length,
    latestReading,
    previousReading,
    currentPeriodConsumption,
    currentEstimatedCost,
    dailyAverageKwh,
    projectedMonthlyKwh,
    projectedMonthlyCost,
    budgetRemaining,
    budgetVariance,
    budgetProgressPercent,
    consumptionStatus,
    statusMessage,
    daysInCurrentCycle: cycleInfo.elapsedDays,
    daysRemainingInCycle: cycleInfo.daysRemaining,
    cycleStartDate: cycleInfo.cycleStartDate,
    cycleEndDate: cycleInfo.cycleEndDate,
    historicalComparison,
  };
}

/**
 * Generate actionable and contextual dynamic insights
 */
export function generateDynamicInsights(
  stats: BillingCycleStats,
  appliances: Appliance[],
  settings: UserSettings
): DynamicInsight[] {
  const insights: DynamicInsight[] = [];

  if (!stats.hasReadings) {
    insights.push({
      id: 'no-readings',
      type: 'info',
      title: 'Start by Recording Your Meter',
      description: 'Find your electric meter outside your house or apartment and record the current numbers.',
      actionLabel: 'Add Meter Reading',
      actionView: 'meter',
    });
    return insights;
  }

  if (stats.totalReadingsCount === 1) {
    insights.push({
      id: 'need-second-reading',
      type: 'info',
      title: 'Baseline Reading Saved',
      description: 'Add a new meter reading in a few days or next week to calculate your first consumption rate and estimated bill.',
      actionLabel: 'Add Next Reading',
      actionView: 'meter',
    });
  }

  // Rate check insight
  if (!settings.electricityRate || settings.electricityRate <= 0) {
    insights.push({
      id: 'missing-rate',
      type: 'warning',
      title: 'Set Your Electricity Rate',
      description: 'Add your electricity rate (₱/kWh) from your latest bill to see accurate peso estimates.',
      actionLabel: 'Set Rate in Settings',
      actionView: 'settings',
    });
  }

  // Appliance insights
  if (appliances.length > 0 && settings.electricityRate > 0) {
    // Sort appliances by monthly consumption
    const sortedAppliances = [...appliances]
      .map((app) => ({
        app,
        stats: calculateApplianceStats(app, settings.electricityRate),
      }))
      .sort((a, b) => b.stats.monthlyKwh - a.stats.monthlyKwh);

    const topAppliance = sortedAppliances[0];

    if (topAppliance && topAppliance.stats.monthlyKwh > 30) {
      const savingOneHourDailyKwh = (topAppliance.app.watts * (topAppliance.app.quantity || 1) * 1 * (topAppliance.app.daysPerWeek / 7) * 30) / 1000;
      const savingOneHourCost = savingOneHourDailyKwh * settings.electricityRate;

      insights.push({
        id: 'top-appliance-saving',
        type: 'tip',
        title: `Largest Consumer: ${topAppliance.app.name}`,
        description: `Estimated at ${topAppliance.stats.monthlyKwh} kWh/mo (${formatCurrency(topAppliance.stats.monthlyCost, settings.currency)}). Reducing use by 1 hour daily could save approx. ${formatCurrency(savingOneHourCost, settings.currency)}/month.`,
        actionLabel: 'View Appliances',
        actionView: 'appliances',
      });
    }
  } else if (appliances.length === 0) {
    insights.push({
      id: 'track-appliances',
      type: 'tip',
      title: 'Track Household Appliances',
      description: 'Add your air conditioner, ref, fans, or TV to see an estimated breakdown of your power consumers.',
      actionLabel: 'Add Appliances',
      actionView: 'appliances',
    });
  }

  // Budget alert insight
  if (settings.monthlyBudget > 0 && stats.projectedMonthlyCost > settings.monthlyBudget) {
    const overAmt = stats.projectedMonthlyCost - settings.monthlyBudget;
    insights.push({
      id: 'budget-warning',
      type: 'warning',
      title: 'Projected to Exceed Budget',
      description: `At current pace (${stats.dailyAverageKwh} kWh/day), your estimated bill may reach ${formatCurrency(stats.projectedMonthlyCost, settings.currency)}, exceeding your ${formatCurrency(settings.monthlyBudget, settings.currency)} budget by ${formatCurrency(overAmt, settings.currency)}.`,
    });
  } else if (settings.monthlyBudget > 0 && stats.totalReadingsCount > 1) {
    const underAmt = settings.monthlyBudget - stats.projectedMonthlyCost;
    if (underAmt > 100) {
      insights.push({
        id: 'budget-positive',
        type: 'positive',
        title: 'Within Monthly Budget',
        description: `Great job! You are projected to finish the billing period ${formatCurrency(underAmt, settings.currency)} below your budget limit.`,
      });
    }
  }

  // Stale reading reminder
  if (stats.latestReading) {
    const lastDate = new Date(stats.latestReading.date);
    const today = new Date();
    const daysSinceLast = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLast >= 7) {
      insights.push({
        id: 'stale-reading',
        type: 'info',
        title: 'Time for a New Meter Check',
        description: `Your last recorded reading was ${daysSinceLast} days ago (${formatDate(stats.latestReading.date)}). Record a fresh reading to keep your forecast accurate.`,
        actionLabel: 'Update Reading',
        actionView: 'meter',
      });
    }
  }

  return insights;
}
