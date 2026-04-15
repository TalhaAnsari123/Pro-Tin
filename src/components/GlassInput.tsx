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
  hideLabel?: boolean;
  freeText?: boolean;
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
  hideLabel = false,
  freeText = false,
}: Props) {
  const id = useId();
  return (
    <div>
      {!hideLabel && (
        <div className="flex items-baseline justify-between mb-1.5 sm:mb-2 px-1">
          <label
            htmlFor={id}
            className="text-xs sm:text-sm uppercase tracking-[0.14em] text-white/65"
          >
            {label}
          </label>
          {hint && (
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/35">
              {hint}
            </span>
          )}
        </div>
      )}
      <div className="glass-input rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2">
        {prefix && (
          <span className="text-white/75 text-lg sm:text-xl font-medium select-none">
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
            if (freeText) {
              onChange(v);
            } else if (v === "" || /^\d*\.?\d*$/.test(v)) {
              onChange(v);
            }
          }}
          placeholder={placeholder}
          className={`w-full min-w-0 bg-transparent outline-none text-white text-lg sm:text-xl placeholder:text-white/25 ${
            freeText ? "" : "tabular-nums"
          }`}
        />
        {suffix && (
          <span className="text-white/55 text-base sm:text-lg select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
