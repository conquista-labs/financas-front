import { Check, Copy, FileText, Sparkles, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  type ImportFmt,
  promptClipboard,
  promptDisplay,
} from "../import.prompts";

interface UploadStepProps {
  onFile: (file: File) => void;
}

const ACCEPT = ".csv,.ofx";
const MAX_MB = 10;

/**
 * Passo 0 — dropzone (CSV/OFX, com OFX preferido) + card de conversão por IA
 * para faturas de cartão ou formatos diferentes. Seleção via clique ou
 * drag&drop; ao escolher um arquivo válido, dispara a análise.
 */
export const UploadStep = ({ onFile }: UploadStepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fmt, setFmt] = useState<ImportFmt>("ofx");
  const [copied, setCopied] = useState(false);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`O arquivo passa de ${MAX_MB} MB. Escolha um menor.`);
      return;
    }
    setError(null);
    onFile(file);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptClipboard(fmt));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não consegui copiar. Selecione o texto manualmente.");
    }
  };

  return (
    <div>
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center rounded-[20px] border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-line bg-card hover:border-primary/50",
        )}
      >
        <span className="grid size-[66px] place-items-center rounded-[18px] bg-primary/soft">
          <UploadCloud className="size-8 text-primary" strokeWidth={1.9} />
        </span>
        <p className="mt-4 font-display text-[19px] font-semibold text-fg">
          Arraste seu arquivo aqui
        </p>
        <p className="mt-1 text-[13.5px] text-muted">
          CSV ou OFX do banco · até {MAX_MB} MB
        </p>

        <span className="mt-[22px] flex items-center gap-2 rounded-[12px] bg-primary px-[22px] py-3 text-sm font-semibold text-white shadow-primary">
          <FileText className="size-4" strokeWidth={2} />
          Selecionar CSV ou OFX
        </span>

        {/* Badge OFX preferido */}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/soft px-[14px] py-[7px]">
          <span className="rounded-md bg-primary/15 px-[7px] py-[2px] text-[11px] font-bold text-primary-strong">
            OFX
          </span>
          <span className="text-[12.5px] font-semibold text-primary-strong">
            Preferido — mais confiável, envie direto sem conversão
          </span>
        </span>

        <p className="mx-auto mt-[14px] max-w-[480px] text-[12.5px] leading-relaxed text-muted">
          Tem OFX? Use OFX: o sinal e as colunas já vêm padronizados, sem
          adivinhação. CSV padrão também vai direto. Para fatura em PDF/print ou
          CSV com layout diferente, use a conversão por IA abaixo.
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>
      )}

      {/* Card helper — conversão por IA */}
      <div className="mt-4 rounded-[18px] border border-line bg-card px-6 py-[22px]">
        <div className="flex items-start gap-[13px]">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-primary/soft">
            <Sparkles className="size-5 text-primary" strokeWidth={1.9} />
          </span>
          <div>
            <h3 className="font-display text-[15.5px] font-semibold text-fg">
              Fatura de cartão ou formato diferente?
            </h3>
            <p className="mt-[3px] text-[13px] leading-relaxed text-muted">
              Peça a uma IA (ChatGPT, Claude…) pra converter o extrato/fatura
              para o nosso formato e envie o CSV gerado. É só colar a instrução
              abaixo junto com o arquivo.
            </p>
          </div>
        </div>

        {/* Caixa do prompt */}
        <div className="mt-4 rounded-[12px] border border-line2 bg-bg px-4 py-[14px]">
          <div className="mb-[11px] flex flex-wrap items-center justify-between gap-2">
            {/* Toggle OFX/CSV — pills com borda individual (fiel ao protótipo) */}
            <div className="flex gap-[5px]">
              {(
                [
                  { v: "ofx", label: "OFX", hint: "(preferido)" },
                  { v: "csv", label: "CSV" },
                ] as { v: ImportFmt; label: string; hint?: string }[]
              ).map((opt) => {
                const active = fmt === opt.v;
                return (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setFmt(opt.v)}
                    className={cn(
                      "rounded-[11px] border px-[14px] py-[9px] text-[13.5px] font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary/soft text-primary-strong"
                        : "border-line bg-card text-fg2 hover:border-primary/40",
                    )}
                  >
                    {opt.label}
                    {opt.hint && (
                      <span className="ml-1 text-[10px] opacity-85">
                        {opt.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botão copiar */}
            <button
              type="button"
              onClick={copyPrompt}
              className="flex items-center gap-[6px] rounded-[9px] bg-primary px-3 py-[7px] text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-strong"
            >
              {copied ? (
                <Check className="size-[14px]" strokeWidth={2.4} />
              ) : (
                <Copy className="size-[14px]" strokeWidth={2} />
              )}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-display text-[12.5px] leading-[1.55] text-fg2">
            {promptDisplay(fmt)}
          </pre>
        </div>

        {/* Nota de sinal/parcela */}
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
          Sinal do valor define o tipo:{" "}
          <strong className="text-danger">negativo = despesa</strong>,{" "}
          <strong className="text-success">positivo = receita</strong>.
          Parcelado vira{" "}
          <code className="rounded-[5px] bg-track px-[6px] py-[1px] font-display">
            parcelaNx
          </code>{" "}
          (N = total de parcelas). CSV e OFX padrão você pode enviar direto.
        </p>
      </div>
    </div>
  );
};
