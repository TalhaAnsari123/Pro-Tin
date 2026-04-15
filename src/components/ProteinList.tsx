"use client";

import { useMemo } from "react";
import type { ProteinEntry } from "./Calculator";

type Props = {
  entries: ProteinEntry[];
  editingId: string | null;
  onModify: (id: string) => void;
  onRemove: (id: string) => void;
};

function formatMoney(value: number, maxFractionDigits = 4): string {
  if (!Number.isFinite(value) || value <= 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export default function ProteinList({
  entries,
  editingId,
  onModify,
  onRemove,
}: Props) {
  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) => a.pricePerGramProtein - b.pricePerGramProtein,
      ),
    [entries],
  );

  const bestId = sorted[0]?.id;

  if (entries.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center text-center text-xs sm:text-sm text-white/40 px-4">
        Fill in the form and tap{" "}
        <span className="text-white/70 mx-1">Calculate</span> to start your
        comparison.
      </div>
    );
  }

  return (
    <section className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1 shrink-0">
        <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/55">
          Comparison · {entries.length}
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-white/30">
          Sorted by $/g protein
        </span>
      </div>

      <ul className="scroll-area flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3 pr-1 pb-1">
        {sorted.map((entry) => {
          const isBest = entry.id === bestId && entries.length > 1;
          const isEditing = entry.id === editingId;
          return (
            <li
              key={entry.id}
              className={`relative glass glass-sheen rounded-2xl p-3 sm:p-4 overflow-hidden transition-all ${
                isEditing ? "ring-2 ring-fuchsia-400/40" : ""
              }`}
            >
              {isBest && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-400/25 via-transparent to-cyan-400/20 blur-xl"
                />
              )}
              <div className="relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">
                        {entry.name}
                      </h3>
                      {isBest && (
                        <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                          Best Value
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[10px] sm:text-[11px] text-white/40">
                      {formatMoney(parse(entry.totalCost), 2)}
                      {entry.totalWeight && ` · ${entry.totalWeight}kg`}
                      {` · ${entry.proteinAmount}g protein/serving`}
                      {` · ${formatNumber(entry.effectiveServings, 1)} servings`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onModify(entry.id)}
                      className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
                    >
                      Modify
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(entry.id)}
                      aria-label="Remove"
                      className="text-white/40 hover:text-red-300 p-1 rounded-md hover:bg-white/10 transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:gap-3">
                  <Stat
                    label="$ / g protein"
                    value={formatMoney(entry.pricePerGramProtein, 4)}
                    accent="from-fuchsia-400/30 to-indigo-500/30"
                  />
                  <Stat
                    label="$ / serving"
                    value={formatMoney(entry.pricePerServing, 2)}
                    accent="from-cyan-400/30 to-emerald-400/30"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="relative glass-soft rounded-xl p-2.5 overflow-hidden">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-40 blur-xl`}
      />
      <div className="relative">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-white/55">
          {label}
        </div>
        <div className="mt-0.5 text-base sm:text-xl font-semibold tabular-nums text-gradient break-all">
          {value}
        </div>
      </div>
    </div>
  );
}

function parse(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function formatNumber(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}
