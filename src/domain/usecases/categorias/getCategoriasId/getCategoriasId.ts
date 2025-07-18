import type { GetCategoriaResponse } from "@/domain/models";

export interface GetCategoriasIdUseCase {
  get: (params: GetCategoriasIdParams) => Promise<GetCategoriasIdModel>;
}

export type GetCategoriasIdModel = GetCategoriaResponse;

export type GetCategoriasIdParams = {
  id: string;
};
