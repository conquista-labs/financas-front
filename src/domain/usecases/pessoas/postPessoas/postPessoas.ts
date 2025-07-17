import type {
  CreatePessoaRequest,
  CreatePessoaResponse,
} from "@/domain/models";

export interface PostPessoasUseCase {
  post: (body: PostPessoasRequest) => Promise<PostPessoasModel>;
}

export type PostPessoasModel = CreatePessoaResponse;
export type PostPessoasRequest = CreatePessoaRequest;
