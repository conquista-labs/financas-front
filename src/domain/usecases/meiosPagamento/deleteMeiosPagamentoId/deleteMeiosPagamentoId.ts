import type { DeleteMeioPagamentoResponse } from "@/domain/models";

export interface DeleteMeiosPagamentoIdUseCase {
  delete: (
    param: DeleteMeiosPagamentoIdParams,
  ) => Promise<DeleteMeiosPagamentoIdModel>;
}

export type DeleteMeiosPagamentoIdModel = DeleteMeioPagamentoResponse;
export type DeleteMeiosPagamentoIdParams = { id: string };
