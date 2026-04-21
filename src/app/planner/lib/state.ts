import { DEFAULT_STATE, type PlannerState } from "./defaults";

// URL encoding: base64(JSON). Compact enough for realistic states (~1–2KB).

export function encodeState(state: PlannerState): string {
  const json = JSON.stringify(state);
  if (typeof window === "undefined") return "";
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeState(param: string | null): PlannerState | null {
  if (!param) return null;
  try {
    const json = decodeURIComponent(escape(atob(param)));
    const parsed = JSON.parse(json) as Partial<PlannerState>;
    // Shallow-merge onto defaults so older/partial URLs still work.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      earners: (parsed.earners ?? DEFAULT_STATE.earners) as PlannerState["earners"],
      kids: parsed.kids ?? DEFAULT_STATE.kids,
      tax: { ...DEFAULT_STATE.tax, ...(parsed.tax ?? {}) },
    };
  } catch {
    return null;
  }
}

export function formatNIS(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${Math.round(n / 1_000)}k`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return Math.round(n).toLocaleString();
}

export function formatNISFull(n: number): string {
  if (!isFinite(n)) return "—";
  return `₪${Math.round(n).toLocaleString()}`;
}
