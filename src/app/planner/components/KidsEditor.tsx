'use client';

import { Button } from "@/components/ui/button";
import { NumField } from "./NumField";
import { Plus, Trash2, Baby } from "lucide-react";
import type { Kid } from "../lib/defaults";

interface Props {
  kids: Kid[];
  onChange: (kids: Kid[]) => void;
}

export function KidsEditor({ kids, onChange }: Props) {
  const addKid = () => {
    onChange([
      ...kids,
      {
        id: Math.random().toString(36).slice(2, 8),
        startYear: kids.length + 1,
        monthlyCost: 4_000,
      },
    ]);
  };

  const updateKid = (id: string, patch: Partial<Kid>) => {
    onChange(kids.map((k) => (k.id === id ? { ...k, ...patch } : k)));
  };

  const removeKid = (id: string) => onChange(kids.filter((k) => k.id !== id));

  return (
    <div className="space-y-2">
      {kids.length === 0 && (
        <div className="text-xs text-muted-foreground italic">No kids in plan yet.</div>
      )}
      {kids.map((k, i) => (
        <div
          key={k.id}
          className="flex items-end gap-2 rounded-lg border p-2 bg-muted/20"
        >
          <Baby className="h-4 w-4 text-muted-foreground mb-2" />
          <div className="text-xs text-muted-foreground mb-2 w-12 shrink-0">Kid {i + 1}</div>
          <NumField
            label="Arrives in year"
            value={k.startYear}
            onChange={(v) => updateKid(k.id, { startYear: Math.max(0, v) })}
            step={1}
            min={0}
            className="flex-1"
          />
          <NumField
            label="+Monthly cost"
            value={k.monthlyCost}
            onChange={(v) => updateKid(k.id, { monthlyCost: v })}
            suffix="₪"
            step={500}
            className="flex-1"
          />
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={() => removeKid(k.id)}
            aria-label="Remove kid"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addKid} className="w-full">
        <Plus className="h-3.5 w-3.5" /> Add kid
      </Button>
    </div>
  );
}
