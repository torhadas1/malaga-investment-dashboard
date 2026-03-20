'use client';

interface PillarBarProps {
  pillars: { label: string; value: number; max: number; color: string }[];
}

export function PillarBar({ pillars }: PillarBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {pillars.map((p) => (
        <div key={p.label} className="flex items-center gap-2" title={`${p.label}: ${p.value}/${p.max} (${Math.round((p.value / p.max) * 100)}%)`}>
          <span className="text-[10px] text-muted-foreground w-16 text-right truncate">{p.label}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(p.value / p.max) * 100}%`,
                backgroundColor: p.color,
              }}
            />
          </div>
          <span className="text-[10px] font-mono w-8 text-right">{p.value}/{p.max}</span>
        </div>
      ))}
    </div>
  );
}
