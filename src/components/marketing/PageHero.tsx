import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#001a40] via-[#00264f] to-[#001028] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#d4af37]/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">{subtitle}</p>
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function CtaButton({
  href,
  children,
  variant = "gold",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "outline";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "gold"
          ? "inline-flex rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#001a40] hover:bg-[#e0c15a]"
          : "inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
      }
    >
      {children}
    </Link>
  );
}
