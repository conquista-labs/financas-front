import { cn } from "@/lib/utils";

import type { ReviewCounts } from "../import.helpers";

interface ReviewSummaryProps {
  counts: ReviewCounts;
  fileName: string;
}

/**
 * KPIs do topo da revisão (fiel ao protótipo): LIDAS · PRONTAS · PRECISAM DE
 * VOCÊ · DUPLICADAS. As duas do meio ganham cor (primary / warning) para puxar
 * o olho para o que precisa de ação; as outras ficam neutras.
 */
export const ReviewSummary = ({ counts, fileName }: ReviewSummaryProps) => {
  const cards = [
    {
      label: "Lidas",
      value: counts.lidas,
      hint: fileName ? `de ${fileName}` : "no extrato",
      tone: "neutral" as const,
    },
    {
      label: "Prontas",
      value: counts.prontas,
      hint: "categoria sugerida com confiança",
      tone: "primary" as const,
    },
    {
      label: "Precisam de você",
      value: counts.atencao,
      hint: "sem palpite bom",
      tone: "warning" as const,
    },
    {
      label: "Duplicadas",
      value: counts.duplicadas,
      hint: counts.duplicadas > 0 ? "já desmarcadas" : "nenhuma detectada",
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={cn(
            "rounded-[16px] border px-[18px] py-4",
            c.tone === "primary" && "border-primary/30 bg-primary/soft",
            c.tone === "warning" && "border-warning/30 bg-warning/10",
            c.tone === "neutral" && "border-line bg-card",
          )}
        >
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.06em]",
              c.tone === "primary" && "text-primary-strong",
              c.tone === "warning" && "text-warning",
              c.tone === "neutral" && "text-muted",
            )}
          >
            {c.label}
          </p>
          <p
            className={cn(
              "mt-[6px] font-display text-[28px] font-bold leading-none",
              c.tone === "primary" && "text-primary-strong",
              c.tone === "warning" && "text-warning",
              c.tone === "neutral" && "text-fg",
            )}
          >
            {c.value}
          </p>
          <p className="mt-[6px] text-[12px] text-muted">{c.hint}</p>
        </div>
      ))}
    </div>
  );
};
