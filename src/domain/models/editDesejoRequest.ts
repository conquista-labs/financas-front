/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface EditDesejoRequest {
  titulo?: string;
  nota?: string;
  /** URL de referência (ex.: link do produto). */
  link?: string;
  valorEstimado?: number;
  prioridade?: EditDesejoRequest.PrioridadeEnum;
}
export namespace EditDesejoRequest {
  export type PrioridadeEnum = "alta" | "media" | "baixa";
}
