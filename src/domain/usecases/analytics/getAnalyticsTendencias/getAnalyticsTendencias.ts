import { GetAnalyticsTendenciasResponse } from "@/domain/models/getAnalyticsTendenciasResponse";

export interface GetAnalyticsTendenciasUsecase {
  get: (
    params: GetAnalyticsTendenciasParams,
  ) => Promise<GetAnalyticsTendenciasModel>;
}

export type GetAnalyticsTendenciasModel = GetAnalyticsTendenciasResponse;

export type GetAnalyticsTendenciasParams = {
  ano: number;
  mes: number;
  mesesHistorico?: number;
};
