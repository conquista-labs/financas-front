import type {
  CreateRecorrenciaRequest,
  RecorrenciaResponse,
} from "@/domain/models";

/** POST /recorrencias — cria a regra e a API já gera as ocorrências. */
export interface PostRecorrenciasUseCase {
  post: (body: PostRecorrenciasRequest) => Promise<PostRecorrenciasModel>;
}

export type PostRecorrenciasModel = RecorrenciaResponse;
export type PostRecorrenciasRequest = CreateRecorrenciaRequest;
