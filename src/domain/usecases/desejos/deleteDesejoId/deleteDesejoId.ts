/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface DeleteDesejoIdUseCase {
  delete: (params: DeleteDesejoIdParams) => Promise<void>;
}

export type DeleteDesejoIdParams = {
  id: string;
};
