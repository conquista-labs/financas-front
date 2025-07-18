import type {
  EditCategoriaRequest,
  EditCategoriaResponse,
} from "@/domain/models";

export interface PatchCategoriasIdUseCase {
  patch: (
    body: PatchCategoriasIdRequest,
    param: PatchCategoriasIdParams,
  ) => Promise<PatchCategoriasIdModel>;
}

export type PatchCategoriasIdModel = EditCategoriaResponse;
export type PatchCategoriasIdRequest = EditCategoriaRequest;
export type PatchCategoriasIdParams = { id: string };
