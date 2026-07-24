import type { EditTagRequest, EditTagResponse } from "@/domain/models";

/** PATCH /tags/{id} — renomeia a tag (propaga a todas as transações). */
export interface PatchTagsIdUseCase {
  patch: (
    body: PatchTagsIdRequest,
    param: PatchTagsIdParams,
  ) => Promise<PatchTagsIdModel>;
}

export type PatchTagsIdModel = EditTagResponse;
export type PatchTagsIdRequest = EditTagRequest;
export type PatchTagsIdParams = { id: string };
