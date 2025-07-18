import type {
  CreateMeioPagamentoRequest,
  CreateMeioPagamentoResponse,
} from "@/domain/models";

export interface PostMeiosPagamentoUseCase {
  post: (body: PostMeiosPagamentoRequest) => Promise<PostMeiosPagamentoModel>;
}

export type PostMeiosPagamentoModel = CreateMeioPagamentoResponse;
export type PostMeiosPagamentoRequest = CreateMeioPagamentoRequest;
