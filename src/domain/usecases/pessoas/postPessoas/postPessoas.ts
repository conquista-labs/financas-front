import type { CreatePessoaDto, PessoaResponseDto } from "@/domain/models";

export interface PostPessoasUseCase {
  post: (body: PostPessoasRequest) => Promise<PostPessoasModel>;
}

export type PostPessoasModel = PessoaResponseDto;
export type PostPessoasRequest = CreatePessoaDto;
