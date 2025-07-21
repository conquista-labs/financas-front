import type { EnumsResponse } from "@/domain/models";

export interface GetEnumsUseCase {
  get: () => Promise<GetEnumsModel>;
}

export type GetEnumsModel = EnumsResponse;
