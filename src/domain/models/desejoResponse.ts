/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { VotoResumo } from "./votoResumo";

export interface DesejoResponse {
  id: string;
  titulo: string;
  nota?: string | null;
  valorEstimado?: number | null;
  prioridade: DesejoResponse.PrioridadeEnum;
  /** Preenchido depois que o desejo é promovido a meta. */
  metaId?: string | null;
  arquivado: boolean;
  votos: Array<VotoResumo>;
  /** true quando TODAS as pessoas ativas votaram (selo "os dois querem"). */
  todosQuerem: boolean;
  createdAt: string;
}
export namespace DesejoResponse {
  export type PrioridadeEnum = "alta" | "media" | "baixa";
}
