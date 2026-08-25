import { CalendarClock, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import type { Tag as TagModel } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ComboboxOption } from "@/presentation/components";

import {
  countLines,
  countSame,
  filterLines,
  normalizeTag,
  numParcelas,
  type ReviewFilter,
  type ReviewLine,
  sameKey,
  totalDespesasIncluidas,
  totalFuturasAgendadas,
} from "../import.helpers";
import { ReviewRow } from "./ReviewRow";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewToolbar } from "./ReviewToolbar";

interface ReviewStepProps {
  fileName: string;
  lines: ReviewLine[];
  categorias: ComboboxOption[];
  pessoas: ComboboxOption[];
  meios: ComboboxOption[];
  formas: ComboboxOption[];
  /** Tags já cadastradas, para sugerir na marcação em lote. */
  tags: TagModel[];
  tag: string;
  onTagChange: (value: string) => void;
  onToggle: (key: string) => void;
  onChangeLine: (key: string, patch: Partial<ReviewLine>) => void;
  /** Aplica um patch a um conjunto de linhas (ações em massa / iguais). */
  onApplyToKeys: (keys: Set<string>, patch: Partial<ReviewLine>) => void;
  /** Marca/desmarca um conjunto de linhas. */
  onToggleKeys: (keys: Set<string>, incluir: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

/**
 * Passo 2 — revisão. KPIs no topo, barra de abas/busca + ações em massa, lista
 * rolável de transações editáveis, tag em lote e rodapé com resumo do que será
 * criado + total de despesas + CTA de importação.
 */
export const ReviewStep = ({
  fileName,
  lines,
  categorias,
  pessoas,
  meios,
  formas,
  tags,
  tag,
  onTagChange,
  onToggle,
  onChangeLine,
  onApplyToKeys,
  onToggleKeys,
  onCancel,
  onConfirm,
  isConfirming,
}: ReviewStepProps) => {
  const [filter, setFilter] = useState<ReviewFilter>("todas");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => countLines(lines), [lines]);
  const selecionadas = lines.filter((l) => l.incluir).length;
  const total = totalDespesasIncluidas(lines);
  const futuras = totalFuturasAgendadas(lines);

  const visible = useMemo(
    () => filterLines(lines, filter, query),
    [lines, filter, query],
  );
  const visibleKeys = useMemo(
    () => new Set(visible.map((l) => l.key)),
    [visible],
  );

  // Tags existentes que casam com o que foi digitado (compara pelo slug, já
  // que o valor enviado é normalizado). Sem texto → mostra as mais usadas.
  const tagSuggestions = useMemo(() => {
    const q = normalizeTag(tag) ?? "";
    return [...tags]
      .sort((a, b) => b.count - a.count)
      .filter((t) => !q || (normalizeTag(t.nome) ?? "").includes(q))
      .slice(0, 8);
  }, [tags, tag]);

  // Aplica os campos preenchidos de uma linha às demais com a mesma descrição.
  const applySame = (line: ReviewLine) => {
    const key = sameKey(line);
    const targets = new Set(
      lines
        .filter((l) => l.key !== line.key && sameKey(l) === key)
        .map((l) => l.key),
    );
    if (!targets.size) return;
    onApplyToKeys(targets, {
      categoriaId: line.categoriaId,
      pessoaId: line.pessoaId,
      meioPagamentoId: line.meioPagamentoId,
      formaPagamento: line.formaPagamento,
    });
  };

  // Liga a propagação de parcelas em todas as exibidas que forem parceladas.
  const createFutures = () => {
    const targets = new Set(
      visible
        .filter((l) => numParcelas(l.formaPagamento) >= 2)
        .map((l) => l.key),
    );
    if (targets.size) onApplyToKeys(targets, { propagarParcelas: true });
  };

  return (
    <div>
      <ReviewSummary counts={counts} fileName={fileName} />

      {/* Card único: toolbar + lista rolável + tag + rodapé */}
      <div className="rounded-[20px] border border-line bg-card px-5 pb-2 pt-[6px]">
        <ReviewToolbar
          filter={filter}
          onFilterChange={setFilter}
          query={query}
          onQueryChange={setQuery}
          counts={counts}
          visible={visible}
          categorias={categorias}
          pessoas={pessoas}
          formas={formas}
          onToggleAll={(incluir) => onToggleKeys(visibleKeys, incluir)}
          onApplyToVisible={(patch) => onApplyToKeys(visibleKeys, patch)}
          onCreateFutures={createFutures}
        />

        {/* Lista de transações (sangra até a borda do card) */}
        <div className="nice-scroll -mx-5 max-h-[440px] overflow-y-auto px-5 [&>*:last-child]:border-0">
          {visible.length === 0 ? (
            <p className="py-12 text-center text-[13.5px] text-muted">
              Nenhuma transação neste filtro.
            </p>
          ) : (
            visible.map((line) => (
              <ReviewRow
                key={line.key}
                line={line}
                categorias={categorias}
                pessoas={pessoas}
                meios={meios}
                formas={formas}
                sameCount={countSame(lines, line)}
                onToggle={() => onToggle(line.key)}
                onChange={(patch) => onChangeLine(line.key, patch)}
                onApplySame={() => applySame(line)}
              />
            ))
          )}
        </div>

        {/* Tag em lote (separada da lista por border-top) */}
        <div className="mt-1 flex flex-wrap items-center gap-[10px] border-t border-line2 px-[2px] pb-1 pt-[14px]">
          <Tag className="size-4 text-muted" strokeWidth={1.9} />
          <label
            htmlFor="import-tag"
            className="text-[12.5px] font-semibold text-muted"
          >
            Marcar todas com a tag:
          </label>
          <input
            id="import-tag"
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            placeholder="ex: importado-julho"
            className="min-w-[180px] rounded-[10px] border border-line bg-card px-3 py-2 text-[13px] outline-none focus:border-primary"
          />
          <span className="text-[12px] text-muted">
            deixe vazio para não marcar
          </span>

          {/* Sugestões: tags já cadastradas — clique para preencher. */}
          {tagSuggestions.length > 0 && (
            <div className="flex w-full flex-wrap items-center gap-[6px]">
              <span className="text-[11.5px] font-medium text-muted">
                Existentes:
              </span>
              {tagSuggestions.map((t) => {
                const active = normalizeTag(tag) === normalizeTag(t.nome);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTagChange(active ? "" : t.nome)}
                    className={cn(
                      "flex items-center gap-[5px] rounded-pill border py-[4px] pl-[10px] pr-[9px] text-[12px] font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary-soft text-primary-strong"
                        : "border-line bg-track text-fg hover:border-primary hover:text-primary",
                    )}
                  >
                    {t.nome}
                    <span className="text-[10.5px] font-medium text-muted">
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé: resumo + cancelar + total + confirmar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-[2px] pb-2 pt-[14px]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isConfirming}
              className="rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-track disabled:opacity-50"
            >
              Cancelar
            </button>
            <span className="flex items-center gap-[6px] text-[12.5px] text-muted">
              <CalendarClock className="size-4" strokeWidth={1.9} />
              {selecionadas} lançamento{selecionadas === 1 ? "" : "s"} agora
              {futuras > 0 &&
                ` · ${futuras} parcela${futuras === 1 ? "" : "s"} futura${
                  futuras === 1 ? "" : "s"
                } agendada${futuras === 1 ? "" : "s"}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[13.5px] text-muted">
              Total despesas:{" "}
              <strong className="font-display text-fg">
                {formatCurrency(total)}
              </strong>
            </span>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming || selecionadas === 0}
              className="rounded-[12px] bg-primary px-[26px] py-3 text-sm font-bold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConfirming
                ? "Importando…"
                : `Importar ${selecionadas} transaç${selecionadas === 1 ? "ão" : "ões"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
