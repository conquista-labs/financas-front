import { Check, EyeOff, Pencil, RotateCcw } from "lucide-react";

import type { LancamentoExterno } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";

import {
  categoriaDe,
  diaMes,
  DICAS,
  type InboxEdit,
  MOTIVOS_IGNORADO,
} from "../inbox.helpers";

interface InboxRowProps {
  lancamento: LancamentoExterno;
  edit?: InboxEdit;
  /** Categorias do MESMO tipo do lançamento (receita/despesa). */
  categorias: ComboboxOption[];
  selecionado: boolean;
  /** "ignorado": mostra o motivo e a ação de restaurar, sem edição. */
  modo: "pendente" | "ignorado";
  ocupado?: boolean;
  onToggle: () => void;
  onChange: (patch: InboxEdit) => void;
  onAceitar: () => void;
  onIgnorar: () => void;
  onRestaurar: () => void;
}

const selectCls =
  "!rounded-[9px] !border-line !px-[9px] !py-[7px] !text-[12.5px]";

const TONS = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/soft text-primary-strong",
};

/**
 * Um lançamento vindo do banco. Pendente: checkbox, descrição editável,
 * categoria (sugerida ou escolhida), valor e ações aceitar/ignorar. Ignorado:
 * mostra o motivo e permite restaurar.
 */
export const InboxRow = ({
  lancamento: l,
  edit,
  categorias,
  selecionado,
  modo,
  ocupado,
  onToggle,
  onChange,
  onAceitar,
  onIgnorar,
  onRestaurar,
}: InboxRowProps) => {
  const isReceita = l.tipo === "receita";
  const dica = l.motivo ? DICAS[l.motivo] : undefined;
  const categoriaId = categoriaDe(l, edit);
  const sugerida =
    !!l.categoriaSugerida && categoriaId === l.categoriaSugerida.id;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-line2 py-3 transition-opacity",
        ocupado && "pointer-events-none opacity-50",
      )}
    >
      {modo === "pendente" && (
        <button
          type="button"
          role="checkbox"
          aria-checked={selecionado}
          aria-label={selecionado ? "Desmarcar" : "Selecionar"}
          onClick={onToggle}
          className={cn(
            "grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2 transition-colors",
            selecionado
              ? "border-primary bg-primary text-white"
              : "border-line bg-transparent",
          )}
        >
          {selecionado && <Check className="size-[13px]" strokeWidth={3} />}
        </button>
      )}

      <span className="w-[46px] shrink-0 text-[12.5px] font-medium text-muted">
        {diaMes(l.data)}
      </span>

      <div className="min-w-0 flex-1">
        {modo === "pendente" ? (
          <div className="group relative">
            <input
              value={edit?.descricao ?? l.descricao}
              onChange={(e) => onChange({ descricao: e.target.value })}
              aria-label="Descrição"
              title={l.descricaoOriginal}
              className="w-full truncate rounded-[9px] border border-transparent bg-transparent py-[4px] pl-2 pr-7 text-[14px] font-semibold text-fg outline-none transition-colors hover:border-line focus:border-primary focus:bg-card"
            />
            <Pencil
              className="pointer-events-none absolute right-2 top-1/2 size-[13px] -translate-y-1/2 text-muted opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.9}
            />
          </div>
        ) : (
          <p className="truncate pl-2 text-[14px] font-semibold text-fg">
            {l.descricao}
          </p>
        )}
        <div className="mt-[2px] flex flex-wrap items-center gap-x-2 gap-y-1 pl-2 text-[11.5px]">
          <span className="text-muted">
            {l.conta.nome}
            {l.pessoa ? ` · ${l.pessoa.nome}` : ""}
          </span>
          {l.totalParcelas && (
            <span
              className={cn("rounded-full px-2 py-[1px] font-bold", TONS.primary)}
            >
              Parcela {l.parcelaNumero}/{l.totalParcelas}
            </span>
          )}
          {modo === "pendente" && dica && (
            <span
              className={cn("rounded-full px-2 py-[1px] font-bold", TONS[dica.tone])}
            >
              {dica.label}
            </span>
          )}
          {modo === "pendente" && sugerida && (
            <span className="font-semibold text-primary">Sugerido</span>
          )}
          {modo === "ignorado" && (
            <span className="rounded-full bg-track px-2 py-[1px] font-semibold text-fg2">
              {MOTIVOS_IGNORADO[l.motivo ?? "manual"] ?? l.motivo}
            </span>
          )}
        </div>
      </div>

      {modo === "pendente" && (
        <Combobox
          options={categorias}
          value={categoriaId}
          onChange={(v) => onChange({ categoriaId: v })}
          placeholder={isReceita ? "Categoria de receita" : "Categoria"}
          searchPlaceholder="Buscar categoria…"
          className={cn(
            selectCls,
            "w-[170px] shrink-0",
            !categoriaId && "!border-warning/60",
          )}
          contentClassName="min-w-[210px]"
        />
      )}

      <span
        className={cn(
          "w-[112px] shrink-0 text-right font-display text-[14.5px] font-semibold",
          isReceita ? "text-success" : "text-fg",
        )}
      >
        {isReceita ? "+ " : "- "}
        {formatCurrency(l.valor)}
      </span>

      <div className="flex w-[68px] shrink-0 justify-end gap-1">
        {modo === "pendente" ? (
          <>
            <button
              type="button"
              onClick={onAceitar}
              aria-label="Aceitar"
              title={categoriaId ? "Aceitar" : "Escolha uma categoria"}
              className="grid size-8 place-items-center rounded-[9px] text-success transition-colors hover:bg-success/10"
            >
              <Check className="size-[17px]" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={onIgnorar}
              aria-label="Ignorar"
              title="Ignorar"
              className="grid size-8 place-items-center rounded-[9px] text-muted transition-colors hover:bg-track hover:text-fg"
            >
              <EyeOff className="size-[16px]" strokeWidth={2} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onRestaurar}
            aria-label="Restaurar"
            title="Voltar para a caixa de entrada"
            className="grid size-8 place-items-center rounded-[9px] text-primary transition-colors hover:bg-primary/soft"
          >
            <RotateCcw className="size-[16px]" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};
