import { Check, X } from "lucide-react";

import type { SaudeFinanceiraDto } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface HealthCardProps {
  saude?: SaudeFinanceiraDto;
  isLoading?: boolean;
}

/** Fatores conhecidos → rótulo legível (na ordem do protótipo). */
const FATORES: { key: string; label: string }[] = [
  { key: "orcamentoRespeitado", label: "Orçamento respeitado" },
  { key: "tendenciaPositiva", label: "Tendência positiva de saldo" },
  { key: "reservaEmergencia", label: "Reserva de emergência" },
  {
    key: "gastoControladoPorCategoria",
    label: "Gasto controlado por categoria",
  },
];

/** Banda de cor pelo score (0-100). */
const band = (score: number) => {
  if (score >= 75)
    return {
      text: "text-success",
      bg: "bg-success/10",
      label: "Saudável",
      bar: "#12A66A",
    };
  if (score >= 50)
    return {
      text: "text-warning",
      bg: "bg-warning/10",
      label: "Atenção",
      bar: "#B76E00",
    };
  return {
    text: "text-danger",
    bg: "bg-danger/10",
    label: "Cuidado",
    bar: "#E5484D",
  };
};

/**
 * "Saúde financeira" — score X/100 (cor por banda) + barra de progresso +
 * lista de fatores com ✓/✗.
 */
export const HealthCard = ({ saude, isLoading }: HealthCardProps) => {
  if (isLoading || !saude)
    return <Skeleton className="h-[300px] rounded-card" />;

  const score = saude.pontuacao ?? 0;
  const b = band(score);
  const fatores = (saude.fatores ?? {}) as Record<string, boolean>;

  return (
    <div className={panel()}>
      <h2 className="mb-4 font-display text-[17px] font-bold text-fg">
        Saúde financeira
      </h2>

      {/* Bloco do score (fundo da banda, centralizado) */}
      <div className={cn("mb-4 rounded-[16px] p-[18px] text-center", b.bg)}>
        <p
          className={cn(
            "font-display text-[40px] font-bold leading-none",
            b.text,
          )}
        >
          {score}
          <span className="text-[16px] text-muted">/100</span>
        </p>
        <p className={cn("mt-1 text-[15px] font-bold", b.text)}>{b.label}</p>
      </div>

      <div className="mb-5 h-[9px] overflow-hidden rounded-pill bg-track">
        <div
          className="h-full rounded-pill"
          style={{ width: `${score}%`, backgroundColor: b.bar }}
        />
      </div>

      <ul className="space-y-[10px]">
        {FATORES.map((f) => {
          const ok = !!fatores[f.key];
          return (
            <li key={f.key} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "grid size-[18px] shrink-0 place-items-center rounded-full",
                  ok
                    ? "bg-success/15 text-success"
                    : "bg-danger/15 text-danger",
                )}
              >
                {ok ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : (
                  <X className="size-3" strokeWidth={3} />
                )}
              </span>
              <span className="text-fg2">{f.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
