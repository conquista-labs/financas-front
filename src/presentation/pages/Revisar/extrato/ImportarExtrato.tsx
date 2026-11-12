import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAnalisarImportacao } from "@/presentation/hooks/api";
import { useFilaExtrato } from "@/presentation/store/filaExtrato";

import { linhasDoExtrato } from "../revisar.fila";
import { normalizeTag } from "./extrato.helpers";
import { UploadStep } from "./UploadStep";

interface ImportarExtratoProps {
  onFechar: () => void;
  /** Depois de importar: mostra o extrato na fila. */
  onImportado: () => void;
}

/**
 * Importar extrato dentro do Revisar: lê o arquivo (POST /importacoes/analisar)
 * e joga as linhas na fila, com as que parecem já lançadas marcadas. Nada vai
 * para o banco até cada linha ser aceita.
 */
export const ImportarExtrato = ({
  onFechar,
  onImportado,
}: ImportarExtratoProps) => {
  const analisar = useAnalisarImportacao();
  const adicionar = useFilaExtrato((s) => s.adicionar);
  const [tag, setTag] = useState("");
  const [arquivo, setArquivo] = useState("");

  const handleFile = (file: File) => {
    setArquivo(file.name);
    analisar.mutate(
      { file },
      {
        onSuccess: (res) => {
          const linhas = linhasDoExtrato(res.data.linhas, {
            arquivo: file.name,
            tag: normalizeTag(tag),
          });
          if (!linhas.length) {
            toast.warning("Não encontrei transações nesse arquivo.");
            return;
          }
          adicionar(linhas);
          const dup = linhas.filter((l) => l.possivelDuplicada).length;
          toast.success(
            `${linhas.length} do extrato na fila` +
              (dup
                ? ` · ${dup} parece${dup === 1 ? "" : "m"} já lançada${dup === 1 ? "" : "s"}`
                : ""),
          );
          setTag("");
          onImportado();
        },
        onError: () =>
          toast.error("Não consegui ler esse extrato. Tente outro arquivo."),
      },
    );
  };

  return (
    <section className="relative rounded-[22px] border-2 border-dashed border-primary/40 bg-card p-5">
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar importação"
        className="absolute right-4 top-4 grid size-9 place-items-center rounded-[10px] bg-bg text-fg2 hover:text-fg"
      >
        <X className="size-4" />
      </button>
      <div className="mb-4 pr-12">
        <p className="text-[15px] font-bold">Importar extrato</p>
        <p className="mt-[3px] text-[13px] text-fg2">
          As transações caem nesta fila, com as que parecem já lançadas
          marcadas. Nada é lançado até você aceitar.
        </p>
      </div>
      {analisar.isPending ? (
        <p className="flex items-center gap-2 py-10 text-sm text-fg2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Lendo {arquivo}…
        </p>
      ) : (
        <>
          <label className="mb-4 flex max-w-[360px] flex-col gap-[5px]">
            <span className="text-xs font-semibold text-fg2">
              Tag para este extrato (opcional)
            </span>
            <input
              value={tag}
              onChange={(ev) => setTag(ev.target.value)}
              placeholder="Ex: fatura-nubank-nov"
              className="h-[38px] rounded-[10px] border border-line bg-card px-[10px] text-[13.5px] outline-none placeholder:text-muted focus:border-primary"
            />
          </label>
          <UploadStep onFile={handleFile} />
        </>
      )}
    </section>
  );
};
