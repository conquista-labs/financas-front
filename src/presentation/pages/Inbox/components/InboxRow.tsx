import { Check, EyeOff, Pencil, RotateCcw, Unlink } from "lucide-react";
import type { ReactNode } from "react";

import type { LancamentoExterno } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui";

import {
  categoriaDe,
  diaMes,
  DICAS,
  type InboxEdit,
  type InboxVisao,
  meioDe,
  MOTIVOS_IGNORADO,
  MOTIVOS_VINCULADO,
  parcelasRestantes,
  pessoaDe,
} from "../inbox.helpers";

interface InboxRowProps {
  lancamento: LancamentoExterno;
  edit?: InboxEdit;
  /** Categorias do MESMO tipo do lançamento (receita/despesa). */
  categorias: ComboboxOption[];
  /** Pessoas ativas (inclui "Casal"); o padrão é o titular da conta. */
  pessoas: ComboboxOption[];
  /** Meios de pagamento; o padrão é o sugerido pela conta/operação. */
  meios: ComboboxOption[];
  selecionado: boolean;
  /**
   * "ignorado": motivo + restaurar. "vinculado": como foi ligado a uma
   * transação existente + desvincular (só o vínculo automático). Sem edição.
   */
  modo: InboxVisao;
  ocupado?: boolean;
  onToggle: () => void;
  onChange: (patch: InboxEdit) => void;
  onAceitar: () => void;
  onIgnorar: () => void;
  onRestaurar: () => void;
  onDesvincular: () => void;
}

const selectCls =
  "!rounded-[9px] !border-line !px-[9px] !py-[7px] !text-[12.5px]";

const TONS = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/soft text-primary-strong",
};

/** Botão só com ícone + tooltip dizendo o que a ação faz. */
const AcaoIcone = ({
  label,
  dica,
  onClick,
  className,
  children,
}: {
  label: string;
  dica: string;
  onClick: () => void;
  className: string;
  children: ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={cn(
          "grid size-8 place-items-center rounded-[9px] transition-colors",
          className,
        )}
      >
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent side="top">{dica}</TooltipContent>
  </Tooltip>
);

/**
 * Um lançamento vindo do banco. Pendente: checkbox, descrição editável,
 * categoria (sugerida ou escolhida), valor e ações aceitar/ignorar. Ignorado:
 * mostra o motivo e permite restaurar. Vinculado: mostra como foi ligado a uma
 * transação que já existia e permite desvincular o automático.
 */
export const InboxRow = ({
  lancamento: l,
  edit,
  categorias,
  pessoas,
  meios,
  selecionado,
  modo,
  ocupado,
  onToggle,
  onChange,
  onAceitar,
  onIgnorar,
  onRestaurar,
  onDesvincular,
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
          {l.banco && (
            <span className="rounded-full bg-track px-2 py-[1px] font-bold text-fg2">
              {l.banco}
            </span>
          )}
          <span className="text-muted">
            {l.conta.nome}
            {/* Na revisão a pessoa fica no seletor ao lado. */}
            {modo !== "pendente" && l.pessoa ? ` · ${l.pessoa.nome}` : ""}
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
          {modo === "pendente" && parcelasRestantes(l) > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={!!edit?.criarFuturas}
                  onClick={() => onChange({ criarFuturas: !edit?.criarFuturas })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-[1px] font-semibold transition-colors",
                    edit?.criarFuturas
                      ? "border-primary bg-primary/soft text-primary-strong"
                      : "border-line text-fg2 hover:border-primary/50",
                  )}
                >
                  {edit?.criarFuturas && (
                    <Check className="size-3" strokeWidth={3} />
                  )}
                  {parcelasRestantes(l) === 1
                    ? "Criar a parcela que falta"
                    : `Criar as ${parcelasRestantes(l)} futuras`}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Cria as parcelas restantes como pendentes, uma por mês. Quando
                o banco trouxer cada uma, é só aceitar que vira paga.
              </TooltipContent>
            </Tooltip>
          )}
          {modo === "ignorado" && (
            <span className="rounded-full bg-track px-2 py-[1px] font-semibold text-fg2">
              {MOTIVOS_IGNORADO[l.motivo ?? "manual"] ?? l.motivo}
            </span>
          )}
          {modo === "vinculado" && (
            <span
              className={cn("rounded-full px-2 py-[1px] font-bold", TONS.success)}
            >
              {MOTIVOS_VINCULADO[l.motivo ?? ""] ?? "Ligado a uma transação"}
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

      {modo === "pendente" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="shrink-0">
              <Combobox
                options={pessoas}
                value={pessoaDe(l, edit)}
                onChange={(v) => onChange({ pessoaId: v })}
                placeholder="Pessoa"
                clearLabel="Ninguém"
                searchPlaceholder="Buscar pessoa…"
                className={cn(selectCls, "w-[118px]")}
                contentClassName="min-w-[180px]"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            De quem é o gasto — o padrão é o titular da conta
          </TooltipContent>
        </Tooltip>
      )}

      {modo === "pendente" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="shrink-0">
              <Combobox
                options={meios}
                value={meioDe(l, edit)}
                onChange={(v) => onChange({ meioPagamentoId: v })}
                placeholder="Meio de pagamento"
                clearLabel="Não informado"
                searchPlaceholder="Buscar meio…"
                className={cn(
                  selectCls,
                  "w-[150px]",
                  !meioDe(l, edit) && "!border-warning/60",
                )}
                contentClassName="min-w-[220px]"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            Meio de pagamento — sugerido pela conta e pelo tipo de operação
          </TooltipContent>
        </Tooltip>
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
            <AcaoIcone
              label="Aceitar"
              dica={
                !categoriaId
                  ? "Escolha uma categoria para aceitar"
                  : l.motivo === "conta_recorrente"
                    ? "Aceitar: marca a conta recorrente como paga"
                    : "Aceitar: vira uma transação com esta categoria"
              }
              onClick={onAceitar}
              className="text-success hover:bg-success/10"
            >
              <Check className="size-[17px]" strokeWidth={2.4} />
            </AcaoIcone>
            <AcaoIcone
              label="Ignorar"
              dica="Ignorar: não entra nas finanças (dá para restaurar)"
              onClick={onIgnorar}
              className="text-muted hover:bg-track hover:text-fg"
            >
              <EyeOff className="size-[16px]" strokeWidth={2} />
            </AcaoIcone>
          </>
        ) : modo === "ignorado" ? (
          <AcaoIcone
            label="Restaurar"
            dica="Restaurar: volta para a caixa de entrada"
            onClick={onRestaurar}
            className="text-primary hover:bg-primary/soft"
          >
            <RotateCcw className="size-[16px]" strokeWidth={2} />
          </AcaoIcone>
        ) : (
          // Só o vínculo automático se desfaz aqui; o de conta recorrente foi
          // decisão de vocês ao aceitar.
          l.motivo === "ja_lancado" && (
            <AcaoIcone
              label="Desvincular"
              dica="Não é o mesmo lançamento: volta para a caixa para revisar"
              onClick={onDesvincular}
              className="text-primary hover:bg-primary/soft"
            >
              <Unlink className="size-[16px]" strokeWidth={2} />
            </AcaoIcone>
          )
        )}
      </div>
    </div>
  );
};
