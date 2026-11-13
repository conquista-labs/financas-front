import { Pencil, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { maskCurrencyInput, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Interruptor (Ativa, Ativo…) — role="switch" para leitores de tela. */
export const Interruptor = ({
  ligado,
  onChange,
  label,
  disabled,
}: {
  ligado: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={ligado}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!ligado)}
    className={cn(
      "flex h-6 w-10 shrink-0 items-center rounded-full p-[2px] transition-colors disabled:opacity-50",
      ligado ? "justify-end bg-primary" : "justify-start bg-track",
    )}
  >
    <span className="size-5 rounded-full bg-white shadow-sm" />
  </button>
);

/**
 * Campo de valor editável na própria linha (Teto, Valor). Salva ao sair do
 * campo ou com Enter; vazio = 0 (sem teto).
 */
export const CampoValor = ({
  label,
  valor,
  onSalvar,
}: {
  label: string;
  valor: number;
  onSalvar: (v: number) => void;
}) => {
  const mascarar = (v: number) =>
    v ? maskCurrencyInput(String(Math.round(v * 100))) : "";
  const [texto, setTexto] = useState(mascarar(valor));
  useEffect(() => setTexto(mascarar(valor)), [valor]);
  const salvar = () => {
    const v = parseAmount(texto);
    if (v !== valor) onSalvar(v);
  };
  return (
    <label className="flex items-center gap-[6px] text-xs text-fg2">
      <span className="w-[38px] text-right">{label}</span>
      <span className="flex h-[34px] w-[124px] items-center gap-1 rounded-[10px] border border-line bg-bg px-[10px] focus-within:border-primary">
        <span className="text-muted">R$</span>
        <input
          value={texto}
          onChange={(e) => setTexto(maskCurrencyInput(e.target.value))}
          onBlur={salvar}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.target as HTMLInputElement).blur()
          }
          inputMode="decimal"
          placeholder="—"
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-fg outline-none placeholder:text-muted"
        />
      </span>
    </label>
  );
};

interface LinhaAjusteProps {
  /** Bolinha de cor (categoria) ou iniciais (pessoa, banco…). */
  cor?: string;
  iniciais?: string;
  nome: string;
  selo?: { texto: string; tom: "danger" | "success" | "primary" | "neutral" };
  sub?: React.ReactNode;
  /** Campo/controle extra à direita (Teto, Valor, interruptor…). */
  extra?: React.ReactNode;
  favorito?: boolean;
  onFavorito?: () => void;
  onEditar?: () => void;
  editarLabel?: string;
  onExcluir?: () => void;
  ocupado?: boolean;
  /** Conteúdo expandido abaixo da linha (edição de banco). */
  children?: React.ReactNode;
}

const SELO = {
  danger: "bg-danger/10 text-danger",
  success: "bg-success/10 text-success",
  primary: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
  neutral: "bg-track text-fg2",
};

/** Uma linha das listas de Ajustes (padrão único do protótipo v2). */
export const LinhaAjuste = ({
  cor,
  iniciais,
  nome,
  selo,
  sub,
  extra,
  favorito,
  onFavorito,
  onEditar,
  editarLabel = "Editar",
  onExcluir,
  ocupado,
  children,
}: LinhaAjusteProps) => {
  const [confirmando, setConfirmando] = useState(false);
  return (
    <div
      className={cn(
        "border-b border-line2 last:border-0",
        ocupado && "opacity-50",
      )}
    >
      <div className="flex flex-wrap items-center gap-3 px-[18px] py-3">
        {cor !== undefined ? (
          <span
            className="size-[22px] shrink-0 rounded-[7px]"
            style={{ backgroundColor: cor }}
            aria-hidden
          />
        ) : (
          <span
            className="grid size-[34px] shrink-0 place-items-center rounded-full bg-primary-soft text-[12.5px] font-bold text-primary-strong dark:text-[#B3A9FF]"
            aria-hidden
          >
            {iniciais}
          </span>
        )}
        <span className="min-w-0 flex-[1_1_180px]">
          <span className="flex min-w-0 items-center gap-[6px] text-[14.5px] font-semibold">
            <span className="truncate" title={nome}>
              {nome}
            </span>
            {selo && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-[7px] py-[1px] text-[11px] font-bold",
                  SELO[selo.tom],
                )}
              >
                {selo.texto}
              </span>
            )}
          </span>
          {sub && (
            <span className="block truncate text-[12.5px] text-fg2">{sub}</span>
          )}
        </span>
        {extra}
        <span className="flex items-center gap-[2px]">
          {onFavorito && (
            <button
              type="button"
              onClick={onFavorito}
              aria-pressed={!!favorito}
              aria-label={
                favorito ? `Tirar ${nome} das favoritas` : `Favoritar ${nome}`
              }
              className={cn(
                "grid size-8 place-items-center rounded-[9px] hover:bg-bg",
                favorito ? "text-star" : "text-muted",
              )}
            >
              <Star className={cn("size-[16px]", favorito && "fill-star")} />
            </button>
          )}
          {onEditar && (
            <button
              type="button"
              onClick={onEditar}
              className="flex h-8 items-center gap-1 rounded-[9px] px-[10px] text-[13px] font-semibold text-primary-strong hover:bg-bg dark:text-[#B3A9FF]"
            >
              <Pencil className="size-[13px]" /> {editarLabel}
            </button>
          )}
          {onExcluir &&
            (confirmando ? (
              <button
                type="button"
                onClick={() => {
                  setConfirmando(false);
                  onExcluir();
                }}
                onBlur={() => setConfirmando(false)}
                autoFocus
                className="h-8 rounded-[9px] bg-danger px-[10px] text-[12.5px] font-bold text-white"
              >
                Excluir?
              </button>
            ) : (
              <button
                type="button"
                aria-label={`Excluir ${nome}`}
                onClick={() => setConfirmando(true)}
                className="grid size-8 place-items-center rounded-[9px] text-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="size-[15px]" />
              </button>
            ))}
        </span>
      </div>
      {children}
    </div>
  );
};
