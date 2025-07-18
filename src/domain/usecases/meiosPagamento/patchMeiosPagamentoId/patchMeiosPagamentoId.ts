import type {
  EditMeioPagamentoRequest,
  EditMeioPagamentoResponse,
} from "@/domain/models";

export interface PatchMeiosPagamentoIdUseCase {
  patch: (
    body: PatchMeiosPagamentoIdRequest,
    param: PatchMeiosPagamentoIdParams,
  ) => Promise<PatchMeiosPagamentoIdModel>;
}

export type PatchMeiosPagamentoIdModel = EditMeioPagamentoResponse;
export type PatchMeiosPagamentoIdRequest = EditMeioPagamentoRequest;
export type PatchMeiosPagamentoIdParams = { id: string };
