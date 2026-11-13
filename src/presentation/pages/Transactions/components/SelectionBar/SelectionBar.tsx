import { useState } from "react";

import { Combobox } from "@/presentation/components";
import { useGetCategorias, useGetPessoas } from "@/presentation/hooks/api";

const OPT = { page: 1, limit: 100 };

interface SelectionBarProps {
  quantidade: number;
  /** Tipo comum dos selecionados (categoria em lote só se todos forem iguais). */
  tipo?: "receita" | "despesa";
  ocupado: boolean;
  onCategoria: (id: string) => void;
  onPessoa: (id: string) => void;
  onTag: (tag: string) => void;
  onExcluir: () => void;
  onCancelar: () => void;
}

/** Ações em lote para as transações marcadas (protótipo v2). */
export const SelectionBar = ({
  quantidade,
  tipo,
  ocupado,
  onCategoria,
  onPessoa,
  onTag,
  onExcluir,
  onCancelar,
}: SelectionBarProps) => {
  const { data: categorias } = useGetCategorias(OPT);
  const { data: pessoas } = useGetPessoas(OPT);
  const [tag, setTag] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[16px] bg-primary-soft px-[14px] py-[10px] text-[13px]">
      <span className="flex-1 font-semibold text-primary-strong dark:text-[#B3A9FF]">
        {quantidade} {quantidade === 1 ? "selecionada" : "selecionadas"}
      </span>
      {tipo && (
        <Combobox
          options={(categorias?.data?.rows ?? [])
            .filter((c) => c.tipo === tipo)
            .map((c) => ({ value: c.id, label: c.nome }))}
          value=""
          onChange={(v) => v && onCategoria(v)}
          placeholder="Categoria…"
          searchPlaceholder="Buscar categoria…"
          className="!h-8 !w-[130px] !rounded-[9px] !bg-card !text-[13px]"
          contentClassName="min-w-[220px]"
        />
      )}
      <Combobox
        options={(pessoas?.data?.rows ?? []).map((p) => ({
          value: p.id,
          label: p.nome,
        }))}
        value=""
        onChange={(v) => v && onPessoa(v)}
        placeholder="Pessoa…"
        searchPlaceholder="Buscar pessoa…"
        className="!h-8 !w-[110px] !rounded-[9px] !bg-card !text-[13px]"
        contentClassName="min-w-[200px]"
      />
      {tag === null ? (
        <button
          type="button"
          onClick={() => setTag("")}
          className="h-8 rounded-[9px] bg-card px-3 font-semibold"
        >
          + Tag
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = tag
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/#/g, "");
            if (t) onTag(t);
            setTag(null);
          }}
        >
          <input
            autoFocus
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onBlur={() => setTag(null)}
            placeholder="nome-da-tag ↵"
            aria-label="Tag para as selecionadas"
            className="h-8 w-[140px] rounded-[9px] border border-primary bg-card px-2 outline-none"
          />
        </form>
      )}
      {confirmando ? (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => {
            setConfirmando(false);
            onExcluir();
          }}
          className="h-8 rounded-[9px] bg-danger px-3 font-bold text-white disabled:opacity-60"
        >
          Excluir {quantidade}?
        </button>
      ) : (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => setConfirmando(true)}
          className="h-8 rounded-[9px] bg-card px-3 font-semibold text-danger disabled:opacity-60"
        >
          Excluir
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setConfirmando(false);
          onCancelar();
        }}
        className="h-8 px-2 font-semibold text-primary-strong dark:text-[#B3A9FF]"
      >
        Cancelar
      </button>
    </div>
  );
};
