import { Copy, Pencil, Trash2 } from "lucide-react";

import type { TransacaoResponse } from "@/domain/models";
import { enhance } from "@/lib/color";
import {
  formatCurrency,
  formatDayMonth,
  formatFormaPagamento,
  parseParcela,
} from "@/lib/format";

import { rowAction } from "../../transactions.styles";

interface TransactionRowProps {
  transacao: TransacaoResponse;
  onEdit: (id: string) => void;
  onDuplicate: (transacao: TransacaoResponse) => void;
  onDelete: (transacao: TransacaoResponse) => void;
}

/**
 * Uma linha da lista de transações (nova identidade). Ícone com a cor da
 * categoria (realçada por enhance), descrição, meta (categoria·pessoa·forma·
 * meio), badge de parcela, valor (verde se receita, cor de texto se despesa —
 * NÃO vermelho, conforme o protótipo), data e ações editar/duplicar/excluir.
 */
export const TransactionRow = ({
  transacao,
  onEdit,
  onDuplicate,
  onDelete,
}: TransactionRowProps) => {
  const { categoria, pessoa, meioPagamento, formaPagamento, valor, data } =
    transacao;

  const isReceita = categoria?.tipo === "receita";
  const catColor = enhance(categoria?.cor);
  const parcela = parseParcela(formaPagamento);
  const forma = formatFormaPagamento(formaPagamento);

  return (
    <div className="flex items-center gap-[14px] border-b border-line2 py-[15px] last:border-b-0">
      {/* Ícone com a cor da categoria */}
      <div
        className="grid size-[42px] shrink-0 place-items-center rounded-[12px]"
        style={{ backgroundColor: `${catColor}1f` }}
      >
        <span
          className="size-[14px] rounded-full"
          style={{ backgroundColor: catColor }}
        />
      </div>

      {/* Descrição + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-fg">
          {transacao.descricao}
        </p>
        <div className="mt-[2px] flex items-center gap-[7px] text-[12.5px] text-muted">
          <span className="font-semibold" style={{ color: catColor }}>
            {categoria?.nome}
          </span>
          {pessoa?.nome && <span>· {pessoa.nome}</span>}
          <span>
            · {forma}
            {meioPagamento?.nome ? ` · ${meioPagamento.nome}` : ""}
          </span>
          {parcela && (
            <span className="rounded-pill bg-primary-soft px-[7px] py-[2px] text-[10.5px] font-bold text-primary-strong">
              {parcela.atual}/{parcela.total}
            </span>
          )}
          {transacao.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-pill bg-track px-2 py-[2px] text-[10.5px] font-semibold text-fg2"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Valor + data */}
      <div className="shrink-0 text-right">
        <p
          className="font-display text-[15.5px] font-semibold"
          style={{ color: isReceita ? "rgb(var(--success))" : undefined }}
        >
          {isReceita ? "+ " : "- "}
          {formatCurrency(valor)}
        </p>
        <p className="text-[12px] text-muted">{formatDayMonth(data)}</p>
      </div>

      {/* Ações */}
      <div className="flex shrink-0 gap-[5px]">
        <button
          type="button"
          aria-label="Editar"
          className={rowAction()}
          onClick={() => onEdit(transacao.id)}
        >
          <Pencil className="size-4" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          aria-label="Duplicar"
          className={rowAction()}
          onClick={() => onDuplicate(transacao)}
        >
          <Copy className="size-4" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          aria-label="Excluir"
          className={rowAction({ tone: "danger" })}
          onClick={() => onDelete(transacao)}
        >
          <Trash2 className="size-4" strokeWidth={1.9} />
        </button>
      </div>
    </div>
  );
};
