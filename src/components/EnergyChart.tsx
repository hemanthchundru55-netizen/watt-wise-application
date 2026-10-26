type Row = {
  appliance: { name: string };
  monthlyKwh: number;
};

export function EnergyChart({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-400">
        Add appliances to see the chart.
      </div>
    );
  }
  const max = Math.max(...rows.map((r) => r.monthlyKwh), 0.0001);
  const sorted = [...rows].sort((a, b) => b.monthlyKwh - a.monthlyKwh);

  return (
    <div className="space-y-3">
      {sorted.map((r) => {
        const pct = Math.max(2, (r.monthlyKwh / max) * 100);
        return (
          <div key={r.appliance.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-navy font-medium truncate pr-2">{r.appliance.name}</span>
              <span className="text-gray-500 tabular-nums">
                {r.monthlyKwh.toLocaleString('en-IN', { maximumFractionDigits: 1 })} kWh
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
