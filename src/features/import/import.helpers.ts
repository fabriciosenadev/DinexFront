export function formatIsoToLocal(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function formatPeriodUtcToLocal(
  start?: string | null,
  end?: string | null
): string {
  const toDateOnly = (iso?: string | null): string | null => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("pt-BR", { dateStyle: "short" });
  };

  const s = toDateOnly(start);
  const e = toDateOnly(end);

  if (s && e) return `${s} — ${e}`;
  if (s && !e) return `${s} — —`;
  if (!s && e) return `— — ${e}`;
  return "—";
}
