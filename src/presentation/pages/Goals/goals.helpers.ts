import type {
  DesejoResponse,
  MetaHistoricoPonto,
  MetaResponse,
} from "@/domain/models";

/** Cor (token) por status de progresso da meta. */
export const statusProgressoMeta: Record<
  MetaResponse.StatusProgressoEnum,
  { label: string; text: string; bg: string; ring: string }
> = {
  no_ritmo: {
    label: "No ritmo",
    text: "text-success",
    bg: "bg-success/10",
    ring: "#12A66A",
  },
  atrasada: {
    label: "Atrasada",
    text: "text-warning",
    bg: "bg-warning/10",
    ring: "#B76E00",
  },
  concluida: {
    label: "Concluída",
    text: "text-primary",
    bg: "bg-primary/10",
    ring: "#5B4BE0",
  },
};

/** Estilo do badge de prioridade do desejo. */
export const prioridadeDesejo: Record<
  DesejoResponse.PrioridadeEnum,
  { label: string; className: string }
> = {
  alta: { label: "Alta", className: "bg-danger/10 text-danger" },
  media: { label: "Média", className: "bg-warning/10 text-warning" },
  baixa: { label: "Baixa", className: "bg-muted/15 text-muted" },
};

/**
 * `background` de um anel de progresso via conic-gradient (técnica donut: um
 * círculo interno `bg-card` fura o meio). `pct` 0–100; a trilha usa o token
 * `--track`, como no protótipo.
 */
export const progressRing = (pct: number, color: string): string => {
  const p = Math.max(0, Math.min(100, pct));
  // --track no projeto é "R G B" (usado como rgb(var(--track))), então aqui
  // precisa do wrapper rgb() para ser uma cor válida no gradient.
  return `conic-gradient(${color} ${p}%, rgb(var(--track)) 0)`;
};

/** Cor do anel por tipo de meta: roxo para acumular, laranja para quitar. */
export const ringColorPorTipo = (tipo: "acumular" | "quitar"): string =>
  tipo === "quitar" ? "#E58E26" : "#5B4BE0";

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

/** ETA legível: "3 meses" / "1 mês" / "—". */
export const formatEta = (etaMeses?: number | null): string => {
  if (etaMeses == null) return "—";
  if (etaMeses <= 0) return "concluída";
  return `${etaMeses} ${etaMeses === 1 ? "mês" : "meses"}`;
};

/** Ponto do gráfico do histórico: "2026-03" → "mar". */
export const historicoChartData = (
  historico: MetaHistoricoPonto[],
): Array<{ mes: string; valor: number }> =>
  historico.map((p) => {
    const [ano, mes] = p.mes.split("-").map(Number);
    const d = new Date(Date.UTC(ano, (mes ?? 1) - 1, 1));
    return {
      mes: d
        .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
        .replace(".", ""),
      valor: p.valor,
    };
  });
