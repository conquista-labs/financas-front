import type {
  CreateTransacaoRequest,
  CreateTransacaoResponse,
} from "@/domain/models";

export interface PostTransacoesUseCase {
  post: (body: PostTransacoesRequest) => Promise<PostTransacoesModel>;
}

export type PostTransacoesModel = CreateTransacaoResponse;
export type PostTransacoesRequest = CreateTransacaoRequest;
