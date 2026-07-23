import {
  CalendarDays,
  type LucideIcon,
  PiggyBank,
  Receipt,
  Shapes,
} from "lucide-react";

import type { QuickStatDto, QuickStatDtoValor } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

interface KpiCardsProps {
  gastoSemana?: QuickStatDto;
  economiaMes?: QuickStatDto;
  maiorCategoria?: QuickStatDto;
  transacaoMaior?: QuickStatDto;
  isLoading?: boolean;
}

/** Mapa token RarUI ($success/$error/$brand) → classe de cor do valor. */
const valueColor = (cor?: string) => {
  if (cor === "$success") return "text-success";
  if (cor === "$error") return "text-danger";
  if (cor === "$brand") return "text-primary";
  return "text-fg";
};

/**
 * Valor do KPI: se for número (ou string numérica), formata como moeda; se for
 * texto (ex.: "Obra" na maior categoria), mostra como está. A API agora entrega
 * valores monetários crus (number).
 */
const kpiValor = (valor: QuickStatDtoValor): string => {
  if (typeof valor === "number") return formatCurrency(valor);
  return valor; // texto (nome de categoria, etc.)
};

interface CardDef {
  stat?: QuickStatDto;
  icon: LucideIcon;
  /** Valor menor (nome de categoria em vez de dinheiro). */
  small?: boolean;
}

const KpiCard = ({ stat, icon: Icon, small }: CardDef) => {
  if (!stat) return <Skeleton className="h-[104px] rounded-[18px]" />;
  return (
    <div className="rounded-[18px] border border-line bg-card px-5 py-[18px]">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon className="size-4" strokeWidth={1.9} />
        <span className="text-[12.5px] font-semibold">{stat.titulo}</span>
      </div>
      <p
        className={cn(
          "font-display font-bold -tracking-[0.02em]",
          small ? "text-[20px]" : "text-[22px]",
          valueColor(stat.cor),
        )}
      >
        {kpiValor(stat.valor)}
      </p>
      {stat.subtitulo && (
        <p className="mt-1 truncate text-[12px] text-muted">{stat.subtitulo}</p>
      )}
    </div>
  );
};

/**
 * Linha de 4 KPIs no topo da dash (Gasto da semana, Economia do mês, Maior
 * categoria, Maior transação). Dados vêm prontos/formatados do QuickStats.
 */
export const KpiCards = ({
  gastoSemana,
  economiaMes,
  maiorCategoria,
  transacaoMaior,
  isLoading,
}: KpiCardsProps) => (
  <div className="grid grid-cols-2 gap-[14px] lg:grid-cols-4">
    <KpiCard stat={isLoading ? undefined : gastoSemana} icon={CalendarDays} />
    <KpiCard stat={isLoading ? undefined : economiaMes} icon={PiggyBank} />
    <KpiCard
      stat={isLoading ? undefined : maiorCategoria}
      icon={Shapes}
      small
    />
    <KpiCard stat={isLoading ? undefined : transacaoMaior} icon={Receipt} />
  </div>
);
