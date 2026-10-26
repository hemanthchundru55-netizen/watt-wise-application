import { Lightbulb, Info } from 'lucide-react';
import { Card, SectionHeading } from './ui';
import { SAVING_TIPS } from '@/lib/sampleData';

export function SavingTips() {
  return (
    <section id="tips" className="scroll-mt-20">
      <Card className="p-5 sm:p-6">
        <SectionHeading
          title="Smart Saving Tips"
          subtitle="Practical suggestions based on common appliance usage patterns."
          icon={<Lightbulb className="w-5 h-5" />}
        />
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAVING_TIPS.map((t) => (
            <div key={t.title} className="rounded-xl border border-gray-100 p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-navy text-sm">{t.title}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 p-4">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            Actual savings depend on your appliance efficiency, age, and usage habits. These tips are
            general guidance, not guarantees.
          </p>
        </div>
      </Card>
    </section>
  );
}

export function Disclaimer() {
  return (
    <div className="mt-6 rounded-xl bg-navy/5 border border-navy/10 p-4 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-navy/60 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-navy/70 leading-relaxed">
        <strong className="font-semibold">Disclaimer:</strong> All figures on this dashboard are
        estimates based on the values you enter and an assumed 30-day month. They are not actual
        electricity bills and may differ from your utility provider's charges.
      </p>
    </div>
  );
}
