import type { Appliance, Totals } from '@/types';

export const DAYS_PER_MONTH = 30;

export function dailyKwh(a: { watts: number; quantity: number; hoursPerDay: number }): number {
  return (a.watts * a.quantity * a.hoursPerDay) / 1000;
}

export function monthlyKwh(a: { watts: number; quantity: number; hoursPerDay: number }): number {
  return dailyKwh(a) * DAYS_PER_MONTH;
}

export function formatINR(value: number): string {
  if (!isFinite(value)) return '₹0';
  const rounded = Math.round(value);
  if (Number.isInteger(value) || Math.abs(value - rounded) < 0.005) {
    return '₹' + rounded.toLocaleString('en-IN');
  }
  return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatKwh(value: number): string {
  if (!isFinite(value)) return '0';
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function computeTotals(appliances: Appliance[], rate: number): Totals {
  const perAppliance = appliances.map((appliance) => {
    const dKwh = dailyKwh(appliance);
    const mKwh = dKwh * DAYS_PER_MONTH;
    return {
      appliance,
      dailyKwh: dKwh,
      monthlyKwh: mKwh,
      monthlyCost: mKwh * rate,
    };
  });

  const dailyKwhTotal = perAppliance.reduce((s, r) => s + r.dailyKwh, 0);
  const monthlyKwhTotal = perAppliance.reduce((s, r) => s + r.monthlyKwh, 0);
  const monthlyCostTotal = perAppliance.reduce((s, r) => s + r.monthlyCost, 0);

  const top = perAppliance.reduce<typeof perAppliance[number] | null>(
    (best, row) => (best === null || row.monthlyKwh > best.monthlyKwh ? row : best),
    null
  );

  return {
    dailyKwh: dailyKwhTotal,
    monthlyKwh: monthlyKwhTotal,
    monthlyCost: monthlyCostTotal,
    topAppliance: top ? { name: top.appliance.name, monthlyKwh: top.monthlyKwh } : null,
    perAppliance,
  };
}

export type WhatIfResult = {
  currentMonthlyKwh: number;
  currentMonthlyCost: number;
  newMonthlyKwh: number;
  newMonthlyCost: number;
  kwhSaved: number;
  costSaved: number;
  savingsPercent: number;
  isIncrease: boolean;
  isNoChange: boolean;
};

export function simulateWhatIf(
  appliance: Appliance,
  newHours: number,
  rate: number
): WhatIfResult {
  const current = monthlyKwh(appliance);
  const next = monthlyKwh({ ...appliance, hoursPerDay: newHours });
  const kwhSaved = current - next;
  const costSaved = kwhSaved * rate;
  const savingsPercent = current > 0 ? (kwhSaved / current) * 100 : 0;
  return {
    currentMonthlyKwh: current,
    currentMonthlyCost: current * rate,
    newMonthlyKwh: next,
    newMonthlyCost: next * rate,
    kwhSaved,
    costSaved,
    savingsPercent,
    isIncrease: kwhSaved < 0,
    isNoChange: Math.abs(kwhSaved) < 1e-9,
  };
}
