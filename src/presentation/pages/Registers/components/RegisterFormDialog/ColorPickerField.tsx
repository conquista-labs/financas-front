import { Info, Plus } from "lucide-react";

import { enhance } from "@/lib/color";
import { cn } from "@/lib/utils";

import { CATEGORY_COLORS } from "./registerForm.definitions";

interface ColorPickerFieldProps {
  value: string;
  onChange: (color: string) => void;
}

/**
 * Cor "acromática" (branco/preto/cinza) — saturação quase nula. O enhance força
 * saturação ≥ 0.55, então essas cores ganham um matiz (viram avermelhadas): o
 * resultado fica bem diferente do escolhido, o que confunde. Detectamos para
 * avisar o usuário.
 */
const isLowSaturation = (hex: string): boolean => {
  if (!hex || hex[0] !== "#") return false;
  let h = hex.slice(1);
  if (h.length === 3)
    h = h
      .split("")
      .map((x) => x + x)
      .join("");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  // amplitude pequena entre canais = cinza/branco/preto
  return mx - mn < 24;
};

/**
 * Seletor de cor da categoria: 8 swatches fixos + cor custom (input color) +
 * prévia da cor "enhanced" nos dois temas. Fiel ao protótipo.
 */
export const ColorPickerField = ({
  value,
  onChange,
}: ColorPickerFieldProps) => {
  const isPreset = CATEGORY_COLORS.includes(value);
  const enhanced = enhance(value);
  const willShift = isLowSaturation(value);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-[10px]">
        {CATEGORY_COLORS.map((color) => {
          const selected = value === color;
          return (
            <button
              key={color}
              type="button"
              aria-label={`Cor ${color}`}
              onClick={() => onChange(color)}
              className="size-[34px] rounded-full border-[3px] border-card transition-transform hover:scale-105"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 0 2px ${selected ? "#17161B" : color}`,
              }}
            />
          );
        })}

        {/* Cor custom */}
        <label
          className="relative grid size-[34px] cursor-pointer place-items-center rounded-full border-[3px] border-card"
          style={{
            background:
              "conic-gradient(#f2545b,#e58e26,#12a66a,#2d9cdb,#6c5ce7,#eb5fa6,#f2545b)",
            boxShadow: `0 0 0 2px ${!isPreset ? "#17161B" : "transparent"}`,
          }}
        >
          <Plus className="size-[14px] text-white" strokeWidth={2.6} />
          <input
            type="color"
            value={value}
            // onInput atualiza AO VIVO enquanto arrasta no seletor nativo;
            // onChange cobre o commit final. Sem o onInput, a prévia só muda
            // ao fechar o seletor (ou nem muda em alguns navegadores).
            onInput={(e) => onChange((e.target as HTMLInputElement).value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* Prévia da cor enhanced sobre fundo claro e escuro */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted">Prévia:</span>
        {[
          { bg: "#ffffff", label: "claro" },
          { bg: "#1c1b22", label: "escuro" },
        ].map((theme) => (
          <div
            key={theme.label}
            className="flex items-center gap-2 rounded-[10px] px-3 py-2"
            style={{ backgroundColor: theme.bg }}
          >
            <span
              className="size-[14px] rounded-full"
              style={{ backgroundColor: enhanced }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: theme.bg === "#ffffff" ? "#17161B" : "#F2F0F4" }}
            >
              {theme.label}
            </span>
          </div>
        ))}
      </div>
      <p className={cn("mt-2 text-[11.5px] text-muted")}>
        A cor é ajustada automaticamente para ficar legível nos dois temas.
      </p>
      {willShift && (
        <p className="mt-2 flex items-start gap-[6px] rounded-[9px] bg-warning/10 px-[10px] py-2 text-[11.5px] font-medium text-warning">
          <Info className="mt-[1px] size-[13px] shrink-0" strokeWidth={2.2} />
          Cores muito claras ou acinzentadas ganham um tom mais forte para
          continuarem visíveis — veja o resultado na prévia acima.
        </p>
      )}
    </div>
  );
};
