'use client';

import { Input } from "@/components/ui/input";

interface NumFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
  className?: string;
}

export function NumField({ label, value, onChange, suffix, step, min, max, hint, className }: NumFieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative">
        <Input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onChange(Number.isFinite(v) ? v : 0);
          }}
          className={suffix ? "pr-10" : ""}
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

// Percentage variant — stores as decimal (0.07) but edits as % (7).
export function PercentField({
  label,
  value,
  onChange,
  step = 0.1,
  hint,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <NumField
      label={label}
      value={Math.round(value * 1000) / 10}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      step={step}
      hint={hint}
      className={className}
    />
  );
}
