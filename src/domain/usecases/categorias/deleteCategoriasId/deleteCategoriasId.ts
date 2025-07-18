import type { DeleteCategoriaResponse } from "@/domain/models";

export interface DeleteCategoriasIdUseCase {
  delete: (param: DeleteCategoriasIdParams) => Promise<DeleteCategoriasIdModel>;
}

export type DeleteCategoriasIdModel = DeleteCategoriaResponse;
export type DeleteCategoriasIdParams = { id: string };
