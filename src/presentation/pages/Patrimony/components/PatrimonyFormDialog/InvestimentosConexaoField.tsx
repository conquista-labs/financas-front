import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import {
  makeGetConexoesInvestimentoFactory,
  makePutVincularInvestimentosFactory,
} from "@/main/factories/usecases";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui";

/** Sentinela p/ "manual" — Radix Select não aceita value="". */
const MANUAL = "__manual__";

interface InvestimentosConexaoFieldProps {
  item: Patrimonio;
  /**
   * Depois de aplicar: o form do patrimônio ainda tem o valor antigo — quem
   * usa fecha o modal, senão um "Salvar" depois sobrescreveria o da corretora.
   */
  onAplicado: () => void;
}

/**
 * "Atualizar pela corretora": liga o patrimônio a uma conexão do MeuPluggy
 * com investimentos. Ligado, o valor atual passa a ser a soma das posições,
 * atualizada na sincronização diária. Aplica na hora (não depende do Salvar).
 */
export const InvestimentosConexaoField = ({
  item,
  onAplicado,
}: InvestimentosConexaoFieldProps) => {
  const queryClient = useQueryClient();
  const conexoes = useQuery({
    queryKey: ["get-conexoes-investimento"],
    queryFn: () => makeGetConexoesInvestimentoFactory().get(),
  });
  const [escolha, setEscolha] = useState(item.pluggyItemId ?? MANUAL);
  useEffect(() => setEscolha(item.pluggyItemId ?? MANUAL), [item.pluggyItemId]);

  const vincular = useMutation({
    mutationFn: (pluggyItemId: string | null) =>
      makePutVincularInvestimentosFactory().put(
        { patrimonioId: item.id },
        { pluggyItemId },
      ),
    onSuccess: () => {
      for (const key of [
        "get-patrimonios",
        "get-resumo-patrimonio",
        "get-evolucao-patrimonio",
        "get-conexoes-investimento",
      ]) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });

  const lista = conexoes.data?.data ?? [];
  const atual = item.pluggyItemId ?? MANUAL;
  const mudou = escolha !== atual;
  const escolhida = lista.find((c) => c.pluggyItemId === escolha);
  const rotulo = (c: (typeof lista)[number]) =>
    `${c.banco ?? "Conexão"}${c.titular ? ` · ${c.titular}` : ""} — ${formatCurrency(c.total)} (${c.posicoesAtivas} ${c.posicoesAtivas === 1 ? "posição" : "posições"})`;

  const aplicar = () =>
    vincular.mutate(escolha === MANUAL ? null : escolha, {
      onSuccess: (r) => {
        toast.success(
          escolha === MANUAL
            ? "Voltou a ser lançado à mão."
            : `Atualizado pela corretora: ${formatCurrency(r.data.total ?? 0)}.`,
        );
        onAplicado();
      },
      onError: (e: Error) => toast.error(e.message),
    });

  return (
    <div className="rounded-[12px] border border-line bg-bg/60 p-3">
      <span className="mb-[7px] flex items-center gap-[6px] text-[12.5px] font-semibold text-muted">
        <Link2 className="size-[14px]" strokeWidth={2} />
        Atualizar pela corretora (Open Finance)
      </span>
      <div className="flex gap-2">
        <Select value={escolha} onValueChange={setEscolha}>
          <SelectTrigger className="flex-1 rounded-[11px] border-line bg-card">
            <SelectValue
              placeholder={conexoes.isLoading ? "Carregando…" : "Escolher"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MANUAL}>Não — valor lançado à mão</SelectItem>
            {lista.map((c) => (
              <SelectItem
                key={c.pluggyItemId}
                value={c.pluggyItemId}
                disabled={!!c.patrimonio && c.patrimonio.id !== item.id}
              >
                {rotulo(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {mudou && (
          <button
            type="button"
            onClick={aplicar}
            disabled={vincular.isPending}
            className="flex items-center gap-[6px] rounded-[11px] bg-primary px-4 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {vincular.isPending && (
              <Loader2 className="size-4 animate-spin" strokeWidth={2} />
            )}
            Aplicar
          </button>
        )}
      </div>
      <p className="mt-[6px] text-[11.5px] text-muted">
        {mudou && escolhida
          ? `O valor atual vai virar ${formatCurrency(escolhida.total)} (soma das posições na corretora) e passa a se atualizar todo dia.`
          : item.pluggyItemId
            ? "O valor atual vem da corretora e se atualiza na sincronização diária."
            : lista.length === 0 && !conexoes.isLoading
              ? "Nenhuma conexão do MeuPluggy com investimentos autorizados."
              : "Ligado a uma conexão, o valor atual vira a soma das posições e se atualiza sozinho."}
      </p>
    </div>
  );
};
