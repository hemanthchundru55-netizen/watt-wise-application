import { useMemo, useState } from 'react';
import { Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { Tariff } from '@/components/Tariff';
import { Dashboard } from '@/components/Dashboard';
import { ApplianceAnalyzer } from '@/components/ApplianceAnalyzer';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { SavingTips, Disclaimer } from '@/components/SavingTips';
import type { Appliance } from '@/types';
import { computeTotals } from '@/lib/calc';
import { SAMPLE_APPLIANCES, DEFAULT_RATE } from '@/lib/sampleData';

function App() {
  const [appliances, setAppliances] = useState<Appliance[]>(SAMPLE_APPLIANCES);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);

  const totals = useMemo(() => computeTotals(appliances, rate), [appliances, rate]);

  function addAppliance(a: Appliance) {
    setAppliances((prev) => [...prev, a]);
  }
  function updateAppliance(a: Appliance) {
    setAppliances((prev) => prev.map((x) => (x.id === a.id ? a : x)));
  }
  function removeAppliance(id: string) {
    setAppliances((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-white" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1">
              <Zap className="w-3.5 h-3.5" fill="currentColor" />
              Energy awareness, simplified
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-navy leading-tight">
              See where your electricity goes — and how to spend less.
            </h1>
            <p className="mt-3 text-gray-500 text-base sm:text-lg leading-relaxed">
              WattWise turns your appliances' power ratings and daily usage into clear estimates of
              monthly consumption, cost, and potential savings.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Tariff rate={rate} onRateChange={setRate} />
        <Dashboard totals={totals} rate={rate} />
        <ApplianceAnalyzer
          appliances={appliances}
          rate={rate}
          onAdd={addAppliance}
          onUpdate={updateAppliance}
          onRemove={removeAppliance}
        />
        <WhatIfSimulator appliances={appliances} rate={rate} onRateChange={setRate} />
        <SavingTips />
        <Disclaimer />
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-400">
          WattWise · Smart Energy Analyzer · Built for demonstration. Estimates only.
        </div>
      </footer>
    </div>
  );
}

export default App;
