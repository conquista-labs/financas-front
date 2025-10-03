import { GetAnalyticsPadroesTemporaisResponse } from "@/domain/models/getAnalyticsPadroesTemporaisResponse";

export interface GetAnalyticsPadroesTemporaisUsecase {
  get: (
    params: GetAnalyticsPadroesTemporaisParams,
  ) => Promise<GetAnalyticsPadroesTemporaisModel>;
}

export type GetAnalyticsPadroesTemporaisModel =
  GetAnalyticsPadroesTemporaisResponse;

export type GetAnalyticsPadroesTemporaisParams = {
  ano: number;
  mes: number;
};
