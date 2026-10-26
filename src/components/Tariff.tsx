import { IndianRupee } from 'lucide-react';

export function Tariff({
  rate,
  onRateChange,
}: {
  rate: number;
  onRateChange: (r: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
      <div className="flex items-center gap-2 text-emerald-700">
        <IndianRupee className="w-4 h-4" />
        <span className="text-sm font-medium">Electricity rate</span>
      </div>
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
          aria-label="Electricity rate per kWh in rupees"
        />
        <span className="text-sm text-emerald-700/80">/ kWh</span>
      </div>
    </div>
  );
}
