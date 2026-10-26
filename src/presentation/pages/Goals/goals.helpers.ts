import type { DesejoResponse } from "@/domain/models";

/** Estilo do badge de prioridade do desejo. */
export const prioridadeDesejo: Record<
  DesejoResponse.PrioridadeEnum,
  { label: string; className: string }
> = {
  alta: { label: "Alta", className: "bg-danger/10 text-danger" },
  media: { label: "Média", className: "bg-warning/10 text-warning" },
  baixa: { label: "Baixa", className: "bg-muted/15 text-muted" },
};

/** Iniciais de um nome (para o avatar/chip de voto). */
export const iniciais = (nome: string): string =>
  nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

/** "2027-03-01T..." → "mar/2027". */
export const mesAnoAlvo = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(".", "");
};

/** "2026-10-20T00:00:00.000Z" → "20/10/26" (dia pelo UTC: a API grava meia-noite UTC). */
export const dataCurta = (iso?: string | null): string =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(2, 4)}` : "";
