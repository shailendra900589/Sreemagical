"use client";

import { CompensationSettings } from "@prisma/client";
import { FormEvent, useState } from "react";

export function CompensationSettingsForm({ initial }: { initial: CompensationSettings }) {
  const [settings, setSettings] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setField(key: keyof CompensationSettings, value: string | boolean) {
    setSettings((s) => ({
      ...s,
      [key]:
        typeof s[key] === "boolean"
          ? value === true || value === "true"
          : Number(value),
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { id: _id, updatedAt: _updatedAt, ...payload } = settings;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setSettings(await res.json());
    setMessage("Settings saved — future BP joinings will use these percentages.");
  }

  const levelFields = Array.from(
    { length: 10 },
    (_, i) => `level${i + 1}Pct` as keyof CompensationSettings,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Section title="1. Direct sponsor income" subtitle="First income — referral commission">
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField
            label="Standard %"
            value={settings.directReferralStandardPct}
            onChange={(v) => setField("directReferralStandardPct", v)}
          />
          <NumberField
            label="Offer %"
            value={settings.directReferralOfferPct}
            onChange={(v) => setField("directReferralOfferPct", v)}
          />
          <label className="flex items-end gap-2 pb-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={settings.offerActive}
              onChange={(e) => setField("offerActive", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Offer period active (use offer %)
          </label>
        </div>
      </Section>

      <Section title="2. Level distribution (10 levels)" subtitle="Second income — upline payouts">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {levelFields.map((key, i) => (
            <NumberField
              key={key}
              label={`Level ${i + 1} %`}
              value={settings[key] as number}
              onChange={(v) => setField(key, v)}
            />
          ))}
        </div>
      </Section>

      <Section title="3. Royalty club pools" subtitle="Third income — turnover share">
        <div className="grid gap-3 sm:grid-cols-4">
          <NumberField label="Total royalty %" value={settings.royaltyTotalPct} onChange={(v) => setField("royaltyTotalPct", v)} />
          <NumberField label="Silver pool %" value={settings.silverPoolPct} onChange={(v) => setField("silverPoolPct", v)} />
          <NumberField label="Gold pool %" value={settings.goldPoolPct} onChange={(v) => setField("goldPoolPct", v)} />
          <NumberField label="Diamond pool %" value={settings.diamondPoolPct} onChange={(v) => setField("diamondPoolPct", v)} />
        </div>
      </Section>

      <Section title="4. Royalty qualification targets" subtitle="Direct BP count & team BP volume">
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField label="Silver min direct BP" value={settings.silverMinDirectBp} onChange={(v) => setField("silverMinDirectBp", v)} step="1" />
          <NumberField label="Gold min direct BP" value={settings.goldMinDirectBp} onChange={(v) => setField("goldMinDirectBp", v)} step="1" />
          <NumberField label="Diamond min direct BP" value={settings.diamondMinDirectBp} onChange={(v) => setField("diamondMinDirectBp", v)} step="1" />
          <NumberField label="Silver min team BP" value={settings.silverMinTeamBp} onChange={(v) => setField("silverMinTeamBp", v)} step="1" />
          <NumberField label="Gold min team BP" value={settings.goldMinTeamBp} onChange={(v) => setField("goldMinTeamBp", v)} step="1" />
          <NumberField label="Diamond min team BP" value={settings.diamondMinTeamBp} onChange={(v) => setField("diamondMinTeamBp", v)} step="1" />
        </div>
      </Section>

      <Section title="5. Package fees" subtitle="Joining amounts (INR)">
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField label="Edu fee" value={settings.eduPackageFee} onChange={(v) => setField("eduPackageFee", v)} />
          <NumberField label="BP fee" value={settings.bpPackageFee} onChange={(v) => setField("bpPackageFee", v)} />
        </div>
      </Section>

      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-[#001a40] px-6 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save all compensation settings"}
      </button>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-base font-semibold text-[#001a40]">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = "0.01",
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
      />
    </label>
  );
}
