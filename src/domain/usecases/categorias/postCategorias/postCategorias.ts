import type {
  CreateCategoriaRequest,
  CreateCategoriaResponse,
} from "@/domain/models";

export interface PostCategoriasUseCase {
  post: (body: PostCategoriasRequest) => Promise<PostCategoriasModel>;
}

export type PostCategoriasModel = CreateCategoriaResponse;
export type PostCategoriasRequest = CreateCategoriaRequest;
