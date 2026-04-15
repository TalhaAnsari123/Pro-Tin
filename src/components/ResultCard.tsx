"use client";

type Props = {
  label: string;
  value: string;
  accent: string;
  active: boolean;
};

export default function ResultCard({ label, value, accent, active }: Props) {
  return (
    <div
      className={`relative glass glass-sheen rounded-2xl p-5 overflow-hidden transition-all duration-500 ${
        active ? "opacity-100" : "opacity-70"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${accent} opacity-30 blur-2xl`}
      />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.14em] text-white/55">
          {label}
        </div>
        <div className="mt-2 text-3xl sm:text-4xl font-semibold tabular-nums text-gradient">
          {value}
        </div>
      </div>
    </div>
  );
}
