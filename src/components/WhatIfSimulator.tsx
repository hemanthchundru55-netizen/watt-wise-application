import { useMemo, useState } from 'react';
import { SlidersHorizontal, ArrowUp, TrendingDown, IndianRupee, Zap, Minus } from 'lucide-react';
import { Card, SectionHeading } from './ui';
import type { Appliance } from '@/types';
import { simulateWhatIf, formatINR, formatKwh, DAYS_PER_MONTH } from '@/lib/calc';

export function WhatIfSimulator({
  appliances,
  rate,
  onRateChange,
}: {
  appliances: Appliance[];
  rate: number;
  onRateChange: (r: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(appliances[0]?.id ?? '');
  const [newHours, setNewHours] = useState<number>(appliances[0]?.hoursPerDay ?? 6);

  const selected = useMemo(
    () => appliances.find((a) => a.id === selectedId) ?? appliances[0] ?? null,
    [appliances, selectedId]
  );

  const result = useMemo(() => {
    if (!selected) return null;
    return simulateWhatIf(selected, newHours, rate);
  }, [selected, newHours, rate]);

  function pick(id: string) {
    const a = appliances.find((x) => x.id === id);
    setSelectedId(id);
    if (a) setNewHours(a.hoursPerDay);
  }

  function clampHours(v: number): number {
    if (!Number.isFinite(v)) return 0;
    return Math.min(24, Math.max(0, v));
  }

  const maxKwh = result ? Math.max(result.currentMonthlyKwh, result.newMonthlyKwh, 0.0001) : 1;

  return (
    <section id="simulator" className="scroll-mt-20">
      <Card className="p-5 sm:p-6">
        <SectionHeading
          title="What-If Energy Simulator"
          subtitle="Pick an appliance, change its daily usage, and see the estimated monthly impact instantly."
          icon={<SlidersHorizontal className="w-5 h-5" />}
        />

        {!selected || !result ? (
          <div className="mt-5 py-10 text-center text-sm text-gray-400">
            Add an appliance in the Analyzer to use the simulator.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select appliance</label>
                <select
                  value={selected.id}
                  onChange={(e) => pick(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {appliances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.watts}W × {a.quantity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current usage readout */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                <span className="text-sm text-gray-500">Current daily usage</span>
                <span className="text-sm font-semibold text-navy tabular-nums">
                  {selected.hoursPerDay} hrs/day
                </span>
              </div>

              {/* Proposed usage: slider + synced numeric input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Proposed daily usage</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      value={newHours}
                      onChange={(e) => setNewHours(clampHours(Number(e.target.value)))}
                      className="w-16 px-2 py-1 rounded-lg border border-gray-200 bg-white text-navy text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums"
                      aria-label="Proposed daily usage in hours"
                    />
                    <span className="text-xs text-gray-500">hrs/day</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={24}
                  step={0.5}
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>0h</span>
                  <span>24h</span>
                </div>
              </div>

              {/* Editable tariff inside the simulator */}
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <IndianRupee className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-medium text-emerald-700">Tariff</span>
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-emerald-700 font-semibold">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={Number.isFinite(rate) ? rate : 0}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onRateChange(Number.isFinite(v) && v >= 0 ? v : 0);
                    }}
                    className="w-20 px-2 py-1.5 rounded-lg border border-emerald-200 bg-white text-navy font-semibold text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    aria-label="Electricity tariff in rupees per kWh"
                  />
                  <span className="text-sm text-emerald-700/80">/ kWh</span>
                </div>
              </div>

              {/* Formula breakdown */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Calculation</p>
                <Row label="Power" value={`${selected.watts} W × ${selected.quantity}`} />
                <Row label="Original hours" value={`${selected.hoursPerDay} hrs/day`} />
                <Row label="Proposed hours" value={`${newHours} hrs/day`} />
                <Row label="Tariff" value={`₹${rate}/kWh`} />
                <Row label="Billing period" value={`${DAYS_PER_MONTH} days`} />
                <p className="mt-2 pt-2 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
                  Monthly kWh = watts × quantity × hours/day × 30 ÷ 1000. Monthly cost = kWh × tariff.
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Headline savings / increase / no change */}
              <div
                className={`rounded-2xl p-5 border transition-colors ${
                  result.isNoChange
                    ? 'bg-gray-50 border-gray-200'
                    : result.isIncrease
                    ? 'bg-red-50 border-red-100'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.isNoChange ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : result.isIncrease ? (
                    <ArrowUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  )}
                  <p className={`text-sm font-medium ${
                    result.isNoChange
                      ? 'text-gray-600'
                      : result.isIncrease
                      ? 'text-red-700'
                      : 'text-emerald-700'
                  }`}>
                    {result.isNoChange
                      ? 'No change in usage'
                      : result.isIncrease
                      ? 'Estimated additional cost'
                      : 'Estimated monthly savings'}
                  </p>
                </div>
                <p className={`mt-2 text-3xl font-bold tracking-tight ${
                  result.isNoChange
                    ? 'text-gray-700'
                    : result.isIncrease
                    ? 'text-red-700'
                    : 'text-emerald-700'
                }`}>
                  {formatINR(Math.abs(result.costSaved))}
                </p>
                <p className={`mt-1 text-sm ${
                  result.isNoChange
                    ? 'text-gray-500'
                    : result.isIncrease
                    ? 'text-red-600/80'
                    : 'text-emerald-600/80'
                }`}>
                  {Math.abs(result.kwhSaved).toLocaleString('en-IN', { maximumFractionDigits: 2 })} kWh / month
                  {' · '}
                  {result.isNoChange ? '0' : `${result.isIncrease ? '+' : ''}${Math.abs(result.savingsPercent).toFixed(1)}%`}
                </p>
              </div>

              {/* Before / After comparison cards */}
              <div className="grid grid-cols-2 gap-3">
                <CompareCard
                  label="Original"
                  hours={selected.hoursPerDay}
                  kwh={result.currentMonthlyKwh}
                  cost={result.currentMonthlyCost}
                  tone="muted"
                />
                <CompareCard
                  label="Proposed"
                  hours={newHours}
                  kwh={result.newMonthlyKwh}
                  cost={result.newMonthlyCost}
                  tone={result.isNoChange ? 'muted' : result.isIncrease ? 'danger' : 'success'}
                />
              </div>

              {/* Visual comparison chart */}
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Monthly consumption comparison
                </p>
                <div className="space-y-3">
                  <Bar
                    label="Original"
                    kwh={result.currentMonthlyKwh}
                    pct={(result.currentMonthlyKwh / maxKwh) * 100}
                    color="bg-navy-700"
                    trackColor="bg-navy/10"
                  />
                  <Bar
                    label="Proposed"
                    kwh={result.newMonthlyKwh}
                    pct={(result.newMonthlyKwh / maxKwh) * 100}
                    color={result.isNoChange ? 'bg-navy-700' : result.isIncrease ? 'bg-red-500' : 'bg-emerald-500'}
                    trackColor={result.isNoChange ? 'bg-navy/10' : result.isIncrease ? 'bg-red-100' : 'bg-emerald-100'}
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-navy-700" /> Original
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-sm ${result.isNoChange ? 'bg-navy-700' : result.isIncrease ? 'bg-red-500' : 'bg-emerald-500'}`} /> Proposed
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 p-3">
                <Zap className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Results are estimates based on your inputs and a 30-day month. Actual bills depend on
                  appliance efficiency and real-world usage.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-500">{label}</span>
      <span className="text-navy font-medium tabular-nums">{value}</span>
    </div>
  );
}

function CompareCard({
  label,
  hours,
  kwh,
  cost,
  tone,
}: {
  label: string;
  hours: number;
  kwh: number;
  cost: number;
  tone: 'muted' | 'success' | 'danger';
}) {
  const styles =
    tone === 'muted'
      ? 'bg-gray-50 border-gray-100'
      : tone === 'success'
      ? 'bg-white border-emerald-200'
      : 'bg-white border-red-200';
  const valueColor = tone === 'success' ? 'text-emerald-700' : tone === 'danger' ? 'text-red-700' : 'text-navy';
  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueColor}`}>{formatINR(cost)}</p>
      <p className="text-xs text-gray-500 tabular-nums">{formatKwh(kwh)} kWh/mo</p>
      <p className="text-[11px] text-gray-400 mt-1">{hours} hrs/day</p>
    </div>
  );
}

function Bar({
  label,
  kwh,
  pct,
  color,
  trackColor,
}: {
  label: string;
  kwh: number;
  pct: number;
  color: string;
  trackColor: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-500 tabular-nums">
          {kwh.toLocaleString('en-IN', { maximumFractionDigits: 1 })} kWh
        </span>
      </div>
      <div className={`h-3 rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
    </div>
  );
}
