import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface UploadStepProps {
  onFile: (file: File) => void;
}

const ACCEPT = ".pdf,.csv,.ofx,.jpg,.jpeg,.png";
const MAX_MB = 10;

/**
 * Passo 0 — dropzone real: seleção via clique ou drag&drop. Aceita PDF, imagem,
 * CSV e OFX até 10 MB. Ao escolher um arquivo válido, dispara a análise.
 */
export const UploadStep = ({ onFile }: UploadStepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`O arquivo passa de ${MAX_MB} MB. Escolha um menor.`);
      return;
    }
    setError(null);
    onFile(file);
  };

  return (
    <div>
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
        <span className="grid size-[66px] place-items-center rounded-[18px] bg-primary/10">
          <UploadCloud className="size-8 text-primary" strokeWidth={1.9} />
        </span>
        <p className="mt-4 font-display text-[19px] font-semibold text-fg">
          Arraste seu extrato aqui
        </p>
        <p className="mt-1 text-[13.5px] text-muted">
          PDF, imagem (JPG/PNG) ou CSV/OFX · até {MAX_MB} MB
        </p>
        <span className="mt-5 rounded-[12px] bg-primary px-[22px] py-3 text-sm font-semibold text-white shadow-primary">
          Escolher arquivo
        </span>
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

      <p className="mx-auto mt-4 max-w-[460px] text-center text-[12.5px] text-muted">
        Dica: CSV/OFX é o mais preciso. Foto e PDF escaneado passam por
        reconhecimento de texto e podem exigir mais conferência.
      </p>
    </div>
  );
};
