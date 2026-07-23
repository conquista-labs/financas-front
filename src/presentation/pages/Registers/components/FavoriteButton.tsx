import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import { rowAction } from "../registers.styles";

interface FavoriteButtonProps {
  favorito: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: "md" | "sm";
}

/**
 * Estrela de favorito (★ cheia amarela / ☆ contorno). Fiel ao protótipo:
 * amarelo #F5B301 quando favorito. O clique dispara o PATCH na lista.
 */
export const FavoriteButton = ({
  favorito,
  onToggle,
  disabled,
  size = "md",
}: FavoriteButtonProps) => (
  <button
    type="button"
    aria-label={favorito ? "Desfavoritar" : "Favoritar"}
    aria-pressed={favorito}
    disabled={disabled}
    onClick={onToggle}
    className={cn(rowAction({ size }), "disabled:opacity-50")}
  >
    <Star
      className={cn(
        size === "sm" ? "size-[15px]" : "size-4",
        favorito ? "fill-star text-star" : "text-muted",
      )}
      strokeWidth={2}
    />
  </button>
);
