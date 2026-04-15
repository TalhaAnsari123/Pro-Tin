"use client";

import { useEffect, useMemo, useState } from "react";
import GlassInput from "./GlassInput";
import ProteinList from "./ProteinList";

type ServingMode = "servings" | "scoop";

type FormState = {
  name: string;
  totalCost: string;
  totalWeight: string;
  proteinAmount: string;
  servings: string;
  scoopSize: string;
  mode: ServingMode;
};

export type ProteinEntry = {
  id: string;
  name: string;
  totalCost: string;
  totalWeight: string;
  proteinAmount: string;
  servings: string;
  scoopSize: string;
  mode: ServingMode;
  pricePerGramProtein: number;
  pricePerServing: number;
  effectiveServings: number;
  totalProteinGrams: number;
};

const emptyForm: FormState = {
  name: "",
  totalCost: "",
  totalWeight: "",
  proteinAmount: "",
  servings: "",
  scoopSize: "",
  mode: "servings",
};

const STORAGE_KEY = "protin.entries.v1";

function parse(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function compute(form: FormState) {
  const cost = parse(form.totalCost);
  const proteinPerServing = parse(form.proteinAmount);
  const totalWeightG = parse(form.totalWeight) * 1000;
  const scoopSize = parse(form.scoopSize);

  const servings =
    form.mode === "servings"
      ? parse(form.servings)
      : scoopSize > 0 && totalWeightG > 0
      ? totalWeightG / scoopSize
      : 0;

  const totalProtein = proteinPerServing * servings;
  const ppg = totalProtein > 0 ? cost / totalProtein : 0;
  const pps = servings > 0 ? cost / servings : 0;

  return {
    pricePerGramProtein: ppg,
    pricePerServing: pps,
    effectiveServings: servings,
    totalProteinGrams: totalProtein,
  };
}

export default function Calculator() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [entries, setEntries] = useState<ProteinEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProteinEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries, hydrated]);

  const setField =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((f) => ({ ...f, [key]: value }));

  const isScoop = form.mode === "scoop";
  const preview = useMemo(() => compute(form), [form]);

  const canCalculate =
    form.name.trim().length > 0 &&
    preview.pricePerGramProtein > 0 &&
    preview.pricePerServing > 0;

  const onCalculate = () => {
    if (!canCalculate) return;
    const result = compute(form);
    const entry: ProteinEntry = {
      id: editingId ?? cryptoId(),
      name: form.name.trim(),
      totalCost: form.totalCost,
      totalWeight: form.totalWeight,
      proteinAmount: form.proteinAmount,
      servings: form.servings,
      scoopSize: form.scoopSize,
      mode: form.mode,
      ...result,
    };

    setEntries((list) => {
      if (editingId) {
        return list.map((e) => (e.id === editingId ? entry : e));
      }
      return [...list, entry];
    });

    setForm(emptyForm);
    setEditingId(null);
  };

  const onModify = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      name: entry.name,
      totalCost: entry.totalCost,
      totalWeight: entry.totalWeight,
      proteinAmount: entry.proteinAmount,
      servings: entry.servings,
      scoopSize: entry.scoopSize,
      mode: entry.mode,
    });
    setEditingId(id);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onRemove = (id: string) => {
    setEntries((list) => list.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="relative">
      <section className="relative glass glass-sheen rounded-[20px] sm:rounded-[24px] p-3 sm:p-7 overflow-hidden">
        {editingId && (
          <div className="mb-3 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg glass-soft text-[11px]">
            <span className="text-white/70">
              Editing{" "}
              <span className="text-white font-medium">
                {form.name || "entry"}
              </span>
            </span>
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-white/50 hover:text-white/90 uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="sm:col-span-2">
            <GlassInput
              label="Protein Name"
              placeholder="e.g. Optimum Gold Standard"
              value={form.name}
              onChange={setField("name")}
              inputMode="text"
              freeText
            />
          </div>

          <GlassInput
            label="Total Cost"
            placeholder="0.00"
            prefix="$"
            value={form.totalCost}
            onChange={setField("totalCost")}
            inputMode="decimal"
          />
          <GlassInput
            label="Total Weight"
            placeholder="0"
            suffix="kg"
            value={form.totalWeight}
            onChange={setField("totalWeight")}
            inputMode="decimal"
            hint={isScoop ? "Required" : "Optional"}
          />
          <GlassInput
            label="Protein per Serving"
            placeholder="0"
            suffix="g"
            value={form.proteinAmount}
            onChange={setField("proteinAmount")}
            inputMode="decimal"
          />

          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-1.5 px-1">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/60">
                {isScoop ? "Scoop Size" : "Servings"}
              </span>
              <div
                role="tablist"
                aria-label="Serving input mode"
                className="glass-soft rounded-full p-0.5 flex items-center text-[9px] sm:text-[10px] uppercase tracking-widest"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isScoop}
                  onClick={() => setField("mode")("servings")}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    !isScoop
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Servings
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isScoop}
                  onClick={() => setField("mode")("scoop")}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    isScoop
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Scoop
                </button>
              </div>
            </div>
            {isScoop ? (
              <GlassInput
                label=""
                placeholder="0"
                suffix="g"
                value={form.scoopSize}
                onChange={setField("scoopSize")}
                inputMode="decimal"
                hideLabel
              />
            ) : (
              <GlassInput
                label=""
                placeholder="0"
                value={form.servings}
                onChange={setField("servings")}
                inputMode="numeric"
                hideLabel
              />
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/50 hover:text-white/90 transition-colors px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:bg-white/5"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate}
            className={`relative overflow-hidden group rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium tracking-wide transition-all ${
              canCalculate
                ? "bg-gradient-to-r from-fuchsia-500/80 via-indigo-500/80 to-cyan-400/80 text-white shadow-[0_8px_30px_-8px_rgba(120,80,255,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(120,80,255,0.8)] hover:brightness-110"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <span className="relative z-10">
              {editingId ? "Update" : "Calculate"}
            </span>
            {canCalculate && (
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] animate-shimmer"
              />
            )}
          </button>
        </div>
      </section>

      <ProteinList
        entries={entries}
        editingId={editingId}
        onModify={onModify}
        onRemove={onRemove}
      />
    </div>
  );
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
