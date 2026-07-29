/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface CreateMetaRequest {
  titulo: string;
  tipo: CreateMetaRequest.TipoEnum;
  valorAlvo: number;
  valorInicial?: number;
  aporteMensal?: number;
  dataAlvo: string;
  /** Nome da tag (não id); o backend faz connectOrCreate. */
  tag?: string;
  /** null = Casal. */
  pessoaId?: string | null;
  patrimonioId?: string | null;
  desejoId?: string;
}
export namespace CreateMetaRequest {
  export type TipoEnum = "acumular" | "quitar";
}
