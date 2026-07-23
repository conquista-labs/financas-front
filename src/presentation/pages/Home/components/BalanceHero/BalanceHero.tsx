import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

interface BalanceHeroProps {
  saldo?: number;
  receitas?: number;
  despesas?: number;
  isLoading?: boolean;
}

/**
 * Hero do saldo do mês (gradiente roxo se ≥ 0, vermelho se < 0) + dois cards
 * empilhados de Receitas/Despesas. Fiel ao protótipo.
 */
export const BalanceHero = ({
  saldo,
  receitas,
  despesas,
  isLoading,
}: BalanceHeroProps) => {
  if (isLoading || saldo == null)
    return (
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-[168px] rounded-hero" />
        <Skeleton className="h-[168px] rounded-hero" />
      </div>
    );

  const positivo = saldo >= 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      {/* Hero saldo */}
      <div
        className="relative overflow-hidden rounded-hero px-7 py-[26px] text-white"
        style={{
          background: positivo
            ? "linear-gradient(150deg,#2b2350 0%,#5B4BE0 130%)"
            : "linear-gradient(150deg,#5a1230 0%,#E5484D 140%)",
          boxShadow: positivo
            ? "0 20px 40px -22px rgba(43,35,80,.7)"
            : "0 20px 40px -22px rgba(229,72,77,.6)",
        }}
      >
        <span className="pointer-events-none absolute -right-8 -top-8 size-[180px] rounded-full bg-white/[0.07]" />
        <p className="text-[13.5px] opacity-80">Saldo do mês</p>
        <p className="mt-1 font-display text-[40px] font-bold -tracking-[0.03em]">
          {formatCurrency(saldo)}
        </p>
        <span className="mt-3 inline-block rounded-pill bg-white/[0.16] px-3 py-[5px] text-[12.5px] font-semibold">
          {positivo ? "no azul" : "no vermelho"} · vs. mês anterior
        </span>
      </div>

      {/* Receitas / Despesas */}
      <div className="flex flex-col gap-4">
        <HeroSideCard
          label="Receitas"
          value={receitas}
          tone="success"
          icon={<ArrowUpRight className="size-5" strokeWidth={2.2} />}
        />
        <HeroSideCard
          label="Despesas"
          value={despesas}
          tone="danger"
          icon={<ArrowDownRight className="size-5" strokeWidth={2.2} />}
        />
      </div>
    </div>
  );
};

interface HeroSideCardProps {
  label: string;
  value?: number;
  tone: "success" | "danger";
  icon: React.ReactNode;
}

const HeroSideCard = ({ label, value, tone, icon }: HeroSideCardProps) => (
  <div className="flex flex-1 items-center gap-3 rounded-[18px] border border-line bg-card px-5 py-[18px]">
    <span
      className={
        tone === "success"
          ? "grid size-11 place-items-center rounded-[13px] bg-success/10 text-success"
          : "grid size-11 place-items-center rounded-[13px] bg-danger/10 text-danger"
      }
    >
      {icon}
    </span>
    <div>
      <p className="text-[12.5px] font-semibold text-muted">{label}</p>
      <p
        className={
          tone === "success"
            ? "font-display text-[23px] font-bold text-success"
            : "font-display text-[23px] font-bold text-danger"
        }
      >
        {formatCurrency(value)}
      </p>
    </div>
  </div>
);
