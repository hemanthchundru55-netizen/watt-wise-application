import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, Plug } from 'lucide-react';
import { Card, SectionHeading } from './ui';
import type { Appliance, ApplianceDraft } from '@/types';
import { formatINR, formatKwh } from '@/lib/calc';

const EMPTY_DRAFT: ApplianceDraft = { name: '', watts: '', quantity: '', hoursPerDay: '' };

function clampNum(s: string, min: number, max: number): number | null {
  if (s.trim() === '') return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  if (n < min) return null;
  if (max !== Infinity && n > max) return null;
  return n;
}

function draftValid(d: ApplianceDraft): { ok: boolean; error?: string } {
  if (d.name.trim() === '') return { ok: false, error: 'Enter a name' };
  const w = clampNum(d.watts, 0, Infinity);
  if (w === null) return { ok: false, error: 'Power must be 0 or more' };
  const q = clampNum(d.quantity, 0, 1000);
  if (q === null) return { ok: false, error: 'Quantity must be 0–1000' };
  const h = clampNum(d.hoursPerDay, 0, 24);
  if (h === null) return { ok: false, error: 'Hours must be 0–24' };
  return { ok: true };
}

export function ApplianceAnalyzer({
  appliances,
  rate,
  onAdd,
  onUpdate,
  onRemove,
}: {
  appliances: Appliance[];
  rate: number;
  onAdd: (a: Appliance) => void;
  onUpdate: (a: Appliance) => void;
  onRemove: (id: string) => void;
}) {
  const [draft, setDraft] = useState<ApplianceDraft>(EMPTY_DRAFT);
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ApplianceDraft>(EMPTY_DRAFT);
  const [editError, setEditError] = useState<string | null>(null);

  function startEdit(a: Appliance) {
    setEditingId(a.id);
    setEditDraft({
      name: a.name,
      watts: String(a.watts),
      quantity: String(a.quantity),
      hoursPerDay: String(a.hoursPerDay),
    });
    setEditError(null);
  }

  function commitEdit(id: string) {
    const v = draftValid(editDraft);
    if (!v.ok) {
      setEditError(v.error ?? 'Invalid');
      return;
    }
    onUpdate({
      id,
      name: editDraft.name.trim(),
      watts: Number(editDraft.watts),
      quantity: Number(editDraft.quantity),
      hoursPerDay: Number(editDraft.hoursPerDay),
    });
    setEditingId(null);
    setEditError(null);
  }

  function handleAdd() {
    const v = draftValid(draft);
    if (!v.ok) {
      setAddError(v.error ?? 'Invalid');
      return;
    }
    onAdd({
      id: `a-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: draft.name.trim(),
      watts: Number(draft.watts),
      quantity: Number(draft.quantity),
      hoursPerDay: Number(draft.hoursPerDay),
    });
    setDraft(EMPTY_DRAFT);
    setAddError(null);
  }

  return (
    <section id="analyzer" className="scroll-mt-20">
      <Card className="p-5 sm:p-6">
        <SectionHeading
          title="Appliance Analyzer"
          subtitle="Add appliances and adjust their usage to see energy and cost per item."
          icon={<Plug className="w-5 h-5" />}
        />

        {/* Add form */}
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
            <Field label="Name" className="col-span-2 sm:col-span-4">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g. Water Heater"
                className={inputCls}
              />
            </Field>
            <Field label="Power (W)" className="col-span-1 sm:col-span-2">
              <input
                type="number"
                min={0}
                value={draft.watts}
                onChange={(e) => setDraft({ ...draft, watts: e.target.value })}
                placeholder="1500"
                className={inputCls}
              />
            </Field>
            <Field label="Quantity" className="col-span-1 sm:col-span-2">
              <input
                type="number"
                min={0}
                value={draft.quantity}
                onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                placeholder="1"
                className={inputCls}
              />
            </Field>
            <Field label="Hours/day" className="col-span-1 sm:col-span-2">
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={draft.hoursPerDay}
                onChange={(e) => setDraft({ ...draft, hoursPerDay: e.target.value })}
                placeholder="6"
                className={inputCls}
              />
            </Field>
            <div className="col-span-2 sm:col-span-2 flex items-end">
              <button
                onClick={handleAdd}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
          {addError && <p className="mt-2 text-sm text-red-600">{addError}</p>}
        </div>

        {/* List */}
        <div className="mt-5 overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                <th className="py-2 pr-3 font-medium">Appliance</th>
                <th className="py-2 px-3 font-medium text-right">Power</th>
                <th className="py-2 px-3 font-medium text-right">Qty</th>
                <th className="py-2 px-3 font-medium text-right">Hrs/day</th>
                <th className="py-2 px-3 font-medium text-right">kWh/mo</th>
                <th className="py-2 px-3 font-medium text-right">Cost/mo</th>
                <th className="py-2 pl-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appliances.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No appliances yet. Add one above to get started.
                  </td>
                </tr>
              )}
              {appliances.map((a) => {
                const editing = editingId === a.id;
                const mKwh = (a.watts * a.quantity * a.hoursPerDay) / 1000 * 30;
                const cost = mKwh * rate;
                if (editing) {
                  return (
                    <tr key={a.id} className="border-t border-gray-100 bg-emerald-50/40">
                      <td className="py-3 pr-3">
                        <input
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          className={inputCls}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input type="number" min={0} value={editDraft.watts}
                          onChange={(e) => setEditDraft({ ...editDraft, watts: e.target.value })}
                          className={`${inputCls} text-right w-20`} />
                      </td>
                      <td className="py-3 px-3">
                        <input type="number" min={0} value={editDraft.quantity}
                          onChange={(e) => setEditDraft({ ...editDraft, quantity: e.target.value })}
                          className={`${inputCls} text-right w-16`} />
                      </td>
                      <td className="py-3 px-3">
                        <input type="number" min={0} max={24} step={0.5} value={editDraft.hoursPerDay}
                          onChange={(e) => setEditDraft({ ...editDraft, hoursPerDay: e.target.value })}
                          className={`${inputCls} text-right w-20`} />
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-xs text-gray-500">
                        {editError && <span className="text-red-600">{editError}</span>}
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => commitEdit(a.id)} className="icon-btn text-emerald-600 hover:bg-emerald-100" aria-label="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditingId(null); setEditError(null); }} className="icon-btn text-gray-500 hover:bg-gray-100" aria-label="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-3 font-medium text-navy">{a.name}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-600">{a.watts} W</td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-600">{a.quantity}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-600">{a.hoursPerDay}</td>
                    <td className="py-3 px-3 text-right tabular-nums font-medium text-navy">{formatKwh(mKwh)}</td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-emerald-700">{formatINR(cost)}</td>
                    <td className="py-3 pl-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => startEdit(a)} className="icon-btn text-gray-500 hover:bg-gray-100" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onRemove(a.id)} className="icon-btn text-red-500 hover:bg-red-50" aria-label="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Energy = watts × quantity × hours ÷ 1000. Monthly figures assume 30 days. Pre-loaded
          appliances are illustrative examples — edit them with your own values for accurate results.
        </p>
      </Card>
    </section>
  );
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400';

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block text-xs font-medium text-gray-500 mb-1">{label}</span>
      {children}
    </label>
  );
}
