import { AlertTriangle, Check, Tag } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { ComboboxOption } from "@/presentation/components";

import { type ReviewLine, totalDespesasIncluidas } from "../import.helpers";
import { ReviewRow } from "./ReviewRow";

interface ReviewStepProps {
  fileName: string;
  lines: ReviewLine[];
  categorias: ComboboxOption[];
  pessoas: ComboboxOption[];
  meios: ComboboxOption[];
  formas: ComboboxOption[];
  tag: string;
  onTagChange: (value: string) => void;
  onToggle: (key: string) => void;
  onChangeLine: (key: string, patch: Partial<ReviewLine>) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

/**
 * Passo 2 — revisão. Cabeçalho com contadores (selecionadas + duplicadas),
 * lista rolável de transações editáveis, tag em lote e rodapé com o total de
 * despesas + CTA de importação.
 */
export const ReviewStep = ({
  fileName,
  lines,
  categorias,
  pessoas,
  meios,
  formas,
  tag,
  onTagChange,
  onToggle,
  onChangeLine,
  onCancel,
  onConfirm,
  isConfirming,
}: ReviewStepProps) => {
  const selecionadas = lines.filter((l) => l.incluir).length;
  const duplicadas = lines.filter((l) => l.possivelDuplicada).length;
  const total = totalDespesasIncluidas(lines);

  return (
    <div>
      {/* Resumo */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-[6px] rounded-full bg-primary/10 px-[14px] py-2 text-[13px] font-semibold text-primary">
          <Check className="size-[15px]" strokeWidth={2.4} />
          {selecionadas} selecionada{selecionadas === 1 ? "" : "s"}
        </span>
        {duplicadas > 0 && (
          <span className="flex items-center gap-[6px] rounded-full bg-warning/10 px-[14px] py-2 text-[13px] font-semibold text-warning">
            <AlertTriangle className="size-[15px]" strokeWidth={2.2} />
            {duplicadas} possível duplicada{duplicadas === 1 ? "" : "s"}
          </span>
        )}
        <span className="text-[13px] text-muted">de {fileName}</span>
      </div>

      {/* Card único: lista rolável + tag + rodapé (fiel ao protótipo) */}
      <div className="rounded-[20px] border border-line bg-card px-5 pb-2 pt-[6px]">
        {/* Lista de transações (sangra até a borda do card) */}
        <div className="nice-scroll -mx-5 max-h-[440px] overflow-y-auto px-5 [&>*:last-child]:border-0">
          {lines.map((line) => (
            <ReviewRow
              key={line.key}
              line={line}
              categorias={categorias}
              pessoas={pessoas}
              meios={meios}
              formas={formas}
              onToggle={() => onToggle(line.key)}
              onChange={(patch) => onChangeLine(line.key, patch)}
            />
          ))}
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
        </div>

        {/* Rodapé: cancelar + total + confirmar (sem border-top próprio) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-[2px] pb-2 pt-[14px]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-track disabled:opacity-50"
          >
            Cancelar
          </button>

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
