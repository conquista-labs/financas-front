import { Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import type { ItemAtencao, TomAtencao } from "../../inicio.helpers";

const TONS: Record<TomAtencao, string> = {
  primary: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

/** "Pede atenção": o que precisa de uma ação agora, cada item leva à tela. */
export const PedeAtencao = ({
  itens,
  isLoading,
}: {
  itens: ItemAtencao[];
  isLoading?: boolean;
}) => (
  <section className="flex min-w-0 flex-col gap-2 rounded-[26px] border border-line bg-card p-5">
    <h2 className="mb-1 font-display text-lg font-bold">Pede atenção</h2>
    {isLoading ? (
      Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[60px] rounded-[16px]" />
      ))
    ) : !itens.length ? (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-success/10 text-success">
          <Check className="size-5" strokeWidth={2.6} />
        </span>
        <p className="text-sm font-semibold">Tudo em dia</p>
        <p className="text-[12.5px] text-fg2">
          Nada para revisar, nenhuma conta vencendo e os tetos sob controle.
        </p>
      </div>
    ) : (
      itens.map((a) => (
        <Link
          key={a.id}
          to={a.href}
          className="flex items-center gap-3 rounded-[16px] bg-bg p-3 transition-colors hover:bg-track"
        >
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-[12px] font-display text-sm font-bold",
              TONS[a.tom],
            )}
          >
            {a.marca}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {a.titulo}
            </span>
            <span className="block truncate text-[12.5px] text-fg2">
              {a.detalhe}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
        </Link>
      ))
    )}
  </section>
);
