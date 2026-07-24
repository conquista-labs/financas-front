import type { DeleteTagResponse } from "@/domain/models";

/** DELETE /tags/{id} — exclui a tag (remove de todas as transações). */
export interface DeleteTagsIdUseCase {
  delete: (param: DeleteTagsIdParams) => Promise<DeleteTagsIdModel>;
}

export type DeleteTagsIdModel = DeleteTagResponse;
export type DeleteTagsIdParams = { id: string };
