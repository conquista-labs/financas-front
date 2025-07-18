import type { GetCategoriasResponse } from "@/domain/models";

export interface GetCategoriasUseCase {
  get: (params: GetCategoriasParams) => Promise<GetCategoriasModel>;
}

export type GetCategoriasModel = GetCategoriasResponse;

export type GetCategoriasParams = {
  page?: number;
  limit?: number;
};
