import type { GetTagsResponse } from "@/domain/models";

/** GET /tags — lista as tags com contagem de uso (`count`). */
export interface GetTagsUseCase {
  get: () => Promise<GetTagsModel>;
}

export type GetTagsModel = GetTagsResponse;
