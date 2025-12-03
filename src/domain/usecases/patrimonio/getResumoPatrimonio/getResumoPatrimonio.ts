import type { GetResumoPatrimonioResponse } from "@/domain/models";

export interface GetResumoPatrimonioUseCase {
  get: (params: GetResumoPatrimonioParams) => Promise<GetResumoPatrimonioModel>;
}

export type GetResumoPatrimonioModel = GetResumoPatrimonioResponse;

export type GetResumoPatrimonioParams = {
  dataReferencia?: string;
};
