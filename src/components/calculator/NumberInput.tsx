import React, { useState, useEffect, useRef } from "react";

/**
 * A robust numeric input that:
 *  - lets the user clear the field completely (doesn't snap to 0 mid-typing)
 *  - allows decimals with either `.` or `,` separator
 *  - pushes numeric values upward as soon as they parse cleanly (live updates)
 *  - clamps to [min, max] only on blur, not on every keystroke
 *  - syncs back if parent changes the value externally
 *
 * Use this instead of `<input type="number">` for any decimal/percent/numeric input.
 */
export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  suffix,
  prefix,
  className,
  placeholder,
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  className: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [raw, setRaw] = useState<string>(() => String(value));
  const lastExternal = useRef<number>(value);

  // If parent changes value externally, resync the displayed string.
  useEffect(() => {
    if (value !== lastExternal.current) {
      const parsed = parseFloat(raw.replace(",", "."));
      if (isNaN(parsed) || parsed !== value) {
        setRaw(String(value));
      }
      lastExternal.current = value;
    }
  }, [value, raw]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    // Permit digits, one separator (. or ,), optional leading minus.
    if (v !== "" && !/^-?\d*[.,]?\d*$/.test(v)) return;
    setRaw(v);

    if (v === "" || v === "." || v === "," || v === "-" || v === "-." || v === "-,") return;
    const num = parseFloat(v.replace(",", "."));
    if (!isNaN(num)) {
      lastExternal.current = num;
      onChange(num);
    }
  }

  function handleBlur() {
    if (raw === "" || raw === "." || raw === "," || raw === "-") {
      setRaw(String(min));
      lastExternal.current = min;
      onChange(min);
      return;
    }
    const num = parseFloat(raw.replace(",", "."));
    if (isNaN(num)) {
      setRaw(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(num, max));
    setRaw(String(clamped));
    lastExternal.current = clamped;
    onChange(clamped);
  }

  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`${className} ${prefix ? "pl-9" : ""} ${suffix ? "pr-10" : ""}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  );
}
