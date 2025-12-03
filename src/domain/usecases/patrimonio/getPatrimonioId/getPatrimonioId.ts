import type { GetPatrimonioResponse } from "@/domain/models";

export interface GetPatrimonioIdUseCase {
  get: (params: GetPatrimonioIdParams) => Promise<GetPatrimonioIdModel>;
}

export type GetPatrimonioIdModel = GetPatrimonioResponse;

export type GetPatrimonioIdParams = {
  id: string;
};
