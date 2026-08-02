/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface DeleteMetaIdUseCase {
  delete: (params: DeleteMetaIdParams) => Promise<void>;
}

export type DeleteMetaIdParams = {
  id: string;
};
