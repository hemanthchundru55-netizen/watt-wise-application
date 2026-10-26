import { Gauge, CalendarDays, Wallet, Crown } from 'lucide-react';
import { Card } from './ui';
import type { Totals } from '@/types';
import { formatINR, formatKwh } from '@/lib/calc';
import { EnergyChart } from './EnergyChart';

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: 'emerald' | 'navy';
}) {
  const colors =
    accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-navy/5 text-navy';
  return (
    <Card className="p-5 transition-shadow hover:shadow-card-hover">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors}`}>
        {icon}
      </div>
      <p className="mt-3 text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </Card>
  );
}

export function Dashboard({ totals, rate }: { totals: Totals; rate: number }) {
  const top = totals.topAppliance;
  return (
    <section id="dashboard" className="scroll-mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Gauge className="w-5 h-5" />}
          label="Daily consumption"
          value={`${formatKwh(totals.dailyKwh)} kWh`}
          sub="Estimated per day"
          accent="emerald"
        />
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          label="Monthly consumption"
          value={`${formatKwh(totals.monthlyKwh)} kWh`}
          sub="Assuming 30 days"
          accent="navy"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Monthly cost"
          value={formatINR(totals.monthlyCost)}
          sub={`At ₹${rate}/kWh`}
          accent="emerald"
        />
        <StatCard
          icon={<Crown className="w-5 h-5" />}
          label="Top consumer"
          value={top ? top.name : '—'}
          sub={top ? `${formatKwh(top.monthlyKwh)} kWh / month` : 'No appliances'}
          accent="navy"
        />
      </div>

      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-navy">Energy consumption breakdown</h3>
            <p className="text-sm text-gray-500">Monthly kWh per appliance</p>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium px-2.5 py-1 border border-amber-100">
            Illustrative sample data
          </span>
        </div>
        <EnergyChart rows={totals.perAppliance} />
        <p className="mt-3 text-xs text-gray-400">
          Pre-loaded appliances are example values for demonstration, not live electricity readings.
          Replace them with your own to get personalised estimates.
        </p>
      </Card>
    </section>
  );
}
