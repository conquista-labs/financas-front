interface AnalyzingStepProps {
  fileName: string;
}

/**
 * Passo 1 — enquanto o backend lê o extrato. Loading indeterminado (sem barra
 * de progresso): a análise devolve tudo de uma vez.
 */
export const AnalyzingStep = ({ fileName }: AnalyzingStepProps) => (
  <div className="flex flex-col items-center rounded-[20px] border border-line bg-card px-6 py-14 text-center">
    <span className="size-[46px] animate-spin rounded-full border-[3px] border-track border-t-primary" />
    <p className="mt-5 font-display text-[18px] font-semibold text-fg">
      Lendo {fileName}…
    </p>
    <p className="mt-1 text-[13.5px] text-muted">
      Extraindo transações e sugerindo categorias
    </p>
  </div>
);
