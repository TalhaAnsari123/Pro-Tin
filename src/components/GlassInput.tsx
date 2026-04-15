"use client";

import { useId } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  inputMode?: "decimal" | "numeric" | "text";
  hint?: string;
};

export default function GlassInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  inputMode = "decimal",
  hint,
}: Props) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 px-1">
        <label
          htmlFor={id}
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/60"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30">
            {hint}
          </span>
        )}
      </div>
      <div className="glass-input rounded-xl px-3 py-1.5 sm:px-4 sm:py-3 flex items-center gap-2">
        {prefix && (
          <span className="text-white/70 text-base sm:text-lg font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            // allow digits, single dot
            if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
          }}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent outline-none text-white text-base sm:text-lg placeholder:text-white/25 tabular-nums"
        />
        {suffix && (
          <span className="text-white/50 text-sm select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}
