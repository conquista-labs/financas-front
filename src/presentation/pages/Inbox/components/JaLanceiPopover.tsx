import { Link2, Loader2 } from "lucide-react";
import { useState } from "react";

import type { LancamentoExterno } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui";
import { useGetCaixaEntradaCandidatas } from "@/presentation/hooks/api";

import { diaMes } from "../inbox.helpers";

interface JaLanceiPopoverProps {
  lancamento: LancamentoExterno;
  onEscolher: (transacaoId: string) => void;
}

/**
 * "Já lancei": mostra as transações que podem ser este lançamento (mesmo
 * valor, até 45 dias da compra ou da fatura) para ligar a uma delas. Só busca
 * ao abrir.
 */
export const JaLanceiPopover = ({
  lancamento: l,
  onEscolher,
}: JaLanceiPopoverProps) => {
  const [aberto, setAberto] = useState(false);
  const candidatas = useGetCaixaEntradaCandidatas(l.id, { enabled: aberto });
  const lista = candidatas.data?.data ?? [];

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Já lancei"
              className={cn(
                "grid size-8 place-items-center rounded-[9px] text-primary transition-colors hover:bg-primary/soft",
                aberto && "bg-primary/soft",
              )}
            >
              <Link2 className="size-[16px]" strokeWidth={2} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          Já lancei: ligar a uma transação que vocês já criaram
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="border-b border-line2 px-4 py-3">
          <p className="text-[13px] font-semibold text-fg">
            Qual destas é {formatCurrency(l.valor)} de {diaMes(l.data)}?
          </p>
          <p className="mt-[2px] text-[11.5px] text-muted">
            Mesmo valor, até 45 dias. Ligar não cria outra transação.
          </p>
        </div>
        <div className="max-h-[280px] overflow-y-auto p-1">
          {candidatas.isLoading ? (
            <p className="flex items-center gap-2 px-3 py-4 text-[12.5px] text-muted">
              <Loader2 className="size-4 animate-spin" /> Procurando…
            </p>
          ) : candidatas.isError ? (
            <p className="px-3 py-4 text-[12.5px] text-danger">
              Não foi possível buscar agora.
            </p>
          ) : lista.length === 0 ? (
            <p className="px-3 py-4 text-[12.5px] text-muted">
              Nenhuma transação com esse valor por perto. Se não precisa
              entrar nas finanças, use Ignorar ou Excluir.
            </p>
          ) : (
            lista.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setAberto(false);
                  onEscolher(t.id);
                }}
                className="w-full rounded-[10px] px-3 py-2 text-left transition-colors hover:bg-track"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold text-fg">
                    {t.descricao}
                  </span>
                  <span className="shrink-0 text-[12px] text-muted">
                    {diaMes(t.data)}
                  </span>
                </div>
                <div className="mt-[2px] flex flex-wrap items-center gap-x-2 text-[11.5px] text-muted">
                  {[t.categoria, t.meioPagamento, t.pessoa]
                    .filter(Boolean)
                    .join(" · ")}
                  {t.mesmoMeio && (
                    <span className="font-semibold text-success">
                      mesmo meio
                    </span>
                  )}
                  {t.status === "pendente" && (
                    <span className="font-semibold text-warning">
                      pendente · vira paga
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
