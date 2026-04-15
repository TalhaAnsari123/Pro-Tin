"use client";

import { useMemo, useState } from "react";
import GlassInput from "./GlassInput";
import ResultCard from "./ResultCard";

type Fields = {
  totalCost: string;
  totalWeight: string;
  proteinAmount: string;
  servings: string;
};

const initial: Fields = {
  totalCost: "",
  totalWeight: "",
  proteinAmount: "",
  servings: "",
};

function parse(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function formatMoney(value: number, maxFractionDigits = 4): string {
  if (!Number.isFinite(value) || value <= 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export default function Calculator() {
  const [fields, setFields] = useState<Fields>(initial);

  const setField = (key: keyof Fields) => (value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const { pricePerGramProtein, pricePerServing, totalProteinGrams } =
    useMemo(() => {
      const cost = parse(fields.totalCost);
      const proteinPerServing = parse(fields.proteinAmount);
      const servings = parse(fields.servings);

      const totalProtein = proteinPerServing * servings;
      const ppg = totalProtein > 0 ? cost / totalProtein : 0;
      const pps = servings > 0 ? cost / servings : 0;

      return {
        pricePerGramProtein: ppg,
        pricePerServing: pps,
        totalProteinGrams: totalProtein,
      };
    }, [fields]);

  const hasResult = pricePerGramProtein > 0 || pricePerServing > 0;

  const reset = () => setFields(initial);

  return (
    <div className="relative">
      <section
        className="relative glass glass-sheen rounded-[24px] p-4 sm:p-7 overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <GlassInput
            label="Total Cost"
            placeholder="0.00"
            prefix="$"
            value={fields.totalCost}
            onChange={setField("totalCost")}
            inputMode="decimal"
          />
          <GlassInput
            label="Total Weight"
            placeholder="0"
            suffix="kg"
            value={fields.totalWeight}
            onChange={setField("totalWeight")}
            inputMode="decimal"
            hint="Optional"
          />
          <GlassInput
            label="Protein per Serving"
            placeholder="0"
            suffix="g"
            value={fields.proteinAmount}
            onChange={setField("proteinAmount")}
            inputMode="decimal"
          />
          <GlassInput
            label="Servings"
            placeholder="0"
            value={fields.servings}
            onChange={setField("servings")}
            inputMode="numeric"
          />
        </div>

        <div className="mt-3 sm:mt-4 flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="text-[11px] uppercase tracking-widest text-white/50 hover:text-white/90 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <ResultCard
          label="Price / gram of protein"
          value={formatMoney(pricePerGramProtein, 4)}
          accent="from-fuchsia-400/40 to-indigo-500/40"
          active={hasResult}
        />
        <ResultCard
          label="Price / serving"
          value={formatMoney(pricePerServing, 2)}
          accent="from-cyan-400/40 to-emerald-400/40"
          active={hasResult}
        />
      </section>

      {totalProteinGrams > 0 && (
        <div className="mt-3 text-center text-[11px] sm:text-xs text-white/50">
          Total protein in container:{" "}
          <span className="text-white/80">
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 1,
            }).format(totalProteinGrams)}
            g
          </span>
        </div>
      )}
    </div>
  );
}
