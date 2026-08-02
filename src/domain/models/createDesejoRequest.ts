/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface CreateDesejoRequest {
  titulo: string;
  nota?: string;
  valorEstimado?: number;
  prioridade?: CreateDesejoRequest.PrioridadeEnum;
  /** pessoaIds que já votam ao criar. */
  votos?: Array<string>;
}
export namespace CreateDesejoRequest {
  export type PrioridadeEnum = "alta" | "media" | "baixa";
}
