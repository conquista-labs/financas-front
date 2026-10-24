import type { CaixaEntradaResumo } from "@/domain/models";
import { Skeleton } from "@/presentation/components/ui";

interface InboxKpisProps {
  resumo?: CaixaEntradaResumo;
  isLoading?: boolean;
}

/** Quatro contadores no topo da caixa de entrada. */
export const InboxKpis = ({ resumo, isLoading }: InboxKpisProps) => {
  if (isLoading || !resumo)
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-[18px]" />
        ))}
      </div>
    );

  const cards = [
    { label: "Para revisar", valor: resumo.pendentes, cls: "text-fg" },
    { label: "Com dica", valor: resumo.comDica, cls: "text-warning" },
    {
      label: "Ignorados automaticamente",
      valor: resumo.ignorados,
      cls: "text-muted",
    },
    { label: "Já lançados", valor: resumo.aceitos, cls: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[18px] border border-line bg-card px-5 py-4"
        >
          <p className="text-[12.5px] text-muted">{c.label}</p>
          <p
            className={`mt-1 font-display text-[26px] font-bold -tracking-[0.02em] ${c.cls}`}
          >
            {c.valor.toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
};
