import type { DeleteTransacaoResponse } from "@/domain/models";

export interface DeleteTransacoesIdUseCase {
  delete: (param: DeleteTransacoesIdParams) => Promise<DeleteTransacoesIdModel>;
}

export type DeleteTransacoesIdModel = DeleteTransacaoResponse;
export type DeleteTransacoesIdParams = { id: string };
