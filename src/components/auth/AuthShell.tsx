import Link from "next/link";
import { GraduationCap, LineChart, ShieldCheck } from "lucide-react";

export function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f3f5f9]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#001a40]/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d878] text-sm font-bold text-[#001a40]">
              M
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[#001a40]">Sri Magicale</p>
              <p className="text-[11px] text-slate-500">Powered by SM Groups</p>
            </div>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[#001a40]">
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-stretch gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-8 lg:py-14">
        <aside className="hidden overflow-hidden rounded-3xl bg-gradient-to-br from-[#001a40] via-[#002b5c] to-[#001028] p-8 text-white shadow-xl lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight lg:text-4xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-white/75">{subtitle}</p>
          </div>

          <ul className="mt-10 space-y-4">
            {[
              {
                icon: GraduationCap,
                label: "Education LMS",
                text: "Classes 8–12 + competitive prep modules",
              },
              {
                icon: LineChart,
                label: "Trading education (BP)",
                text: "Stock, Forex & market analysis practice",
              },
              {
                icon: ShieldCheck,
                label: "Transparent payouts",
                text: "Admin-controlled referral, level & royalty %",
              },
            ].map(({ icon: Icon, label, text }) => (
              <li key={label} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-white/65">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 items-start lg:items-center">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:max-w-lg sm:p-6 lg:max-w-none lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  minLength,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#001a40] outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/25"
        />
      )}
    </label>
  );
}
