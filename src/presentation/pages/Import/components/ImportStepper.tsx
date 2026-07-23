import { cn } from "@/lib/utils";

interface ImportStepperProps {
  /** Passo atual: 0 = enviar, 1 = processando, 2 = revisar. */
  step: number;
}

const STEPS = [
  { n: 1, label: "Enviar" },
  { n: 2, label: "Revisar" },
  { n: 3, label: "Confirmar" },
];

/**
 * Stepper de 3 passos (Enviar · Revisar · Confirmar). A bolinha fica roxa
 * quando o passo já foi alcançado. Revisar+Confirmar acontecem na mesma tela,
 * então o 3º só acende ao confirmar.
 */
export const ImportStepper = ({ step }: ImportStepperProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {STEPS.map((s, i) => {
      const reached = step >= i;
      return (
        <div key={s.n} className="flex items-center gap-2">
          <div className="flex items-center gap-[9px]">
            <span
              className={cn(
                "grid size-[26px] place-items-center rounded-full text-[12.5px] font-bold transition-colors",
                reached ? "bg-primary text-white" : "bg-track text-muted",
              )}
            >
              {s.n}
            </span>
            <span
              className={cn(
                "text-[13px] font-semibold",
                reached ? "text-fg" : "text-muted",
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span className="h-[2px] w-8 shrink-0 bg-line" />
          )}
        </div>
      );
    })}
  </div>
);
