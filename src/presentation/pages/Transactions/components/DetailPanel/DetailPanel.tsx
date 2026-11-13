import { ExternalLink, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { EditTransacaoRequest, TransacaoResponse } from "@/domain/models";
import { formatCurrency, maskCurrencyInput, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, DateField } from "@/presentation/components";
import {
  useGetCategorias,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";

import { ehReceita } from "../../transactions.helpers";
import { useTransacaoMutations } from "../../useTransacaoMutations";

const OPT = { page: 1, limit: 100 };
const mascarar = (v: number | string) =>
  maskCurrencyInput(String(Math.round(parseAmount(v) * 100)));

const Linha = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[96px_1fr] items-center gap-2 text-[13px] text-fg2">
    {label}
    <div className="min-w-0 text-fg">{children}</div>
  </div>
);

interface DetailPanelProps {
  transacao: TransacaoResponse;
  onFechar: () => void;
  onExcluir: (t: TransacaoResponse) => void;
  onFormularioCompleto: (id: string) => void;
}

/**
 * Detalhes da transação aberta (coluna da direita): cada campo salva sozinho
 * (PATCH parcial) ao mudar ou ao sair do campo. Use com `key={id}` para
 * reiniciar os rascunhos ao trocar de transação.
 */
export const DetailPanel = ({
  transacao: t,
  onFechar,
  onExcluir,
  onFormularioCompleto,
}: DetailPanelProps) => {
  const { atualizar, pagar } = useTransacaoMutations();
  const { data: categorias } = useGetCategorias(OPT);
  const { data: pessoas } = useGetPessoas(OPT);
  const { data: meios } = useGetMeiosPagamento(OPT);

  const [descricao, setDescricao] = useState(t.descricao);
  const [valor, setValor] = useState(mascarar(t.valor));
  const [observacoes, setObservacoes] = useState(t.observacoes ?? "");
  const [novaTag, setNovaTag] = useState<string | null>(null);

  const tipo = ehReceita(t) ? "receita" : "despesa";
  const salvando = atualizar.isPending || pagar.isPending;
  const parcela =
    t.parcelaNumero && t.totalParcelas && t.totalParcelas > 1
      ? `${t.parcelaNumero}/${t.totalParcelas}`
      : null;

  const salvar = (body: EditTransacaoRequest) =>
    atualizar.mutate(
      { ids: [t.id], body },
      { onError: () => toast.error("Não foi possível salvar. Tente de novo.") },
    );

  const tags = t.tags ?? [];

  return (
    <aside
      aria-label="Detalhes da transação"
      className="flex min-w-0 flex-col gap-3 rounded-[24px] border border-line bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-fg2">
          Detalhes · {salvando ? "salvando…" : "salva sozinho"}
        </span>
        <button
          type="button"
          aria-label="Fechar detalhes"
          onClick={onFechar}
          className="grid size-8 place-items-center rounded-[9px] bg-bg text-fg2 hover:text-fg"
        >
          <X className="size-4" />
        </button>
      </div>

      <input
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        onBlur={() => {
          const d = descricao.trim();
          if (d && d !== t.descricao) salvar({ descricao: d });
          else setDescricao(t.descricao);
        }}
        aria-label="Descrição"
        className="h-10 rounded-[10px] border border-transparent bg-bg px-[10px] text-[17px] font-bold outline-none focus:border-primary"
      />

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-display text-[28px] font-bold",
            tipo === "receita" ? "text-success" : "text-fg",
          )}
        >
          {tipo === "receita" ? "+" : "-"}
        </span>
        <span className="text-[15px] text-muted">R$</span>
        <input
          value={valor}
          onChange={(e) => setValor(maskCurrencyInput(e.target.value))}
          onBlur={() => {
            const v = parseAmount(valor);
            if (v > 0 && v !== parseAmount(t.valor)) salvar({ valor: v });
            else setValor(mascarar(t.valor));
          }}
          inputMode="decimal"
          aria-label="Valor"
          className="w-[150px] rounded-[10px] border border-transparent bg-transparent font-display text-[28px] font-bold outline-none focus:border-primary"
        />
        {parcela && (
          <span className="rounded-full bg-primary-soft px-2 py-[2px] text-xs font-bold text-primary-strong dark:text-[#B3A9FF]">
            parcela {parcela}
          </span>
        )}
      </div>

      <Linha label="Categoria">
        <Combobox
          inline
          options={(categorias?.data?.rows ?? [])
            .filter((c) => c.tipo === tipo)
            .map((c) => ({ value: c.id, label: c.nome }))}
          value={t.categoriaId || undefined}
          onChange={(v) =>
            v && v !== t.categoriaId && salvar({ categoriaId: v })
          }
          placeholder="Escolher"
          searchPlaceholder="Buscar categoria…"
        />
      </Linha>
      <Linha label="Pessoa">
        <Combobox
          inline
          options={(pessoas?.data?.rows ?? []).map((p) => ({
            value: p.id,
            label: p.nome,
          }))}
          value={t.pessoaId || undefined}
          onChange={(v) => v && v !== t.pessoaId && salvar({ pessoaId: v })}
          placeholder="Ninguém"
          searchPlaceholder="Buscar pessoa…"
        />
      </Linha>
      <Linha label="Meio">
        <Combobox
          inline
          options={(meios?.data?.rows ?? []).map((m) => ({
            value: m.id,
            label: m.nome,
          }))}
          value={t.meioPagamentoId || undefined}
          onChange={(v) =>
            v && v !== t.meioPagamentoId && salvar({ meioPagamentoId: v })
          }
          placeholder="Não informado"
          searchPlaceholder="Buscar meio…"
        />
      </Linha>
      <Linha label="Data">
        <DateField
          inline
          value={t.data.slice(0, 10)}
          onChange={(v) =>
            v &&
            v !== t.data.slice(0, 10) &&
            salvar({ data: new Date(`${v}T12:00:00`).toISOString() })
          }
        />
      </Linha>
      <Linha label="Forma">
        <span className="text-[13.5px]">{t.formaPagamento ?? "—"}</span>
      </Linha>
      <Linha label="Situação">
        <div className="flex gap-1 rounded-[11px] bg-track p-1">
          {(
            [
              ["paga", "Já paga", "text-success"],
              ["pendente", "A pagar", "text-warning"],
            ] as const
          ).map(([v, label, cor]) => {
            const ativo = (t.status === "paga") === (v === "paga");
            return (
              <button
                key={v}
                type="button"
                disabled={ativo || salvando}
                onClick={() =>
                  v === "paga"
                    ? pagar.mutate(t.id, {
                        onError: () =>
                          toast.error("Não foi possível marcar como paga."),
                      })
                    : salvar({ status: "pendente" })
                }
                className={cn(
                  "h-8 flex-1 rounded-[8px] text-[13px] font-bold",
                  ativo ? cn("bg-card shadow-sm", cor) : "text-fg2",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Linha>

      <div className="flex flex-wrap items-center gap-[6px]">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => salvar({ tags: tags.filter((x) => x !== tag) })}
            title="Remover tag"
            className="rounded-full bg-primary-soft px-[10px] py-1 text-xs font-bold text-primary-strong hover:line-through dark:text-[#B3A9FF]"
          >
            #{tag}
          </button>
        ))}
        {novaTag === null ? (
          <button
            type="button"
            onClick={() => setNovaTag("")}
            className="h-7 rounded-full border border-dashed border-muted px-[10px] text-xs font-semibold text-fg2"
          >
            + tag
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = novaTag
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/#/g, "");
              if (n && !tags.includes(n)) salvar({ tags: [...tags, n] });
              setNovaTag(null);
            }}
          >
            <input
              autoFocus
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              onBlur={() => setNovaTag(null)}
              placeholder="nome-da-tag ↵"
              aria-label="Nova tag"
              className="h-7 w-[130px] rounded-full border border-primary px-[10px] text-xs outline-none"
            />
          </form>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={!!t.lembrarMe}
        onClick={() => salvar({ lembrarMe: !t.lembrarMe })}
        className="flex items-center gap-[10px] text-[13.5px]"
      >
        <span
          className={cn(
            "flex h-6 w-10 items-center rounded-full p-[2px] transition-colors",
            t.lembrarMe ? "justify-end bg-primary" : "justify-start bg-track",
          )}
        >
          <span className="size-5 rounded-full bg-white shadow-sm" />
        </span>
        Lembrar-me no calendário
      </button>

      <textarea
        rows={2}
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        onBlur={() => {
          if (observacoes !== (t.observacoes ?? "")) salvar({ observacoes });
        }}
        placeholder="Observações"
        aria-label="Observações"
        className="resize-none rounded-[10px] border border-line bg-card p-[10px] text-[13.5px] outline-none placeholder:text-muted focus:border-primary"
      />

      <div className="flex items-center justify-between gap-2 border-t border-line2 pt-3">
        <button
          type="button"
          onClick={() => onFormularioCompleto(t.id)}
          className="flex items-center gap-1 text-[13px] font-semibold text-fg2 hover:text-primary"
        >
          <ExternalLink className="size-[14px]" /> Formulário completo
        </button>
        <button
          type="button"
          onClick={() => onExcluir(t)}
          className="flex h-9 items-center gap-[6px] rounded-[10px] bg-danger/10 px-3 text-[13px] font-semibold text-danger"
        >
          <Trash2 className="size-[14px]" /> Excluir
        </button>
      </div>
      <p className="text-[11.5px] text-muted">
        {formatCurrency(t.valor)} · lançado em{" "}
        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
      </p>
    </aside>
  );
};
