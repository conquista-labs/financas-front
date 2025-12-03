import type { GetEvolucaoPatrimonioResponse } from "@/domain/models";

export interface GetEvolucaoPatrimonioUseCase {
  get: (
    params: GetEvolucaoPatrimonioParams,
  ) => Promise<GetEvolucaoPatrimonioModel>;
}

export type GetEvolucaoPatrimonioModel = GetEvolucaoPatrimonioResponse;

export type GetEvolucaoPatrimonioParams = {
  dataInicio: string;
  dataFim: string;
  granularidade?: "mensal";
};
