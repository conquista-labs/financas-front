import { GetQuickStatsResponse } from "@/domain/models/getQuickStatsResponse";

export interface GetQuickStatsUsecase {
  get: (params: GetQuickStatsParams) => Promise<GetQuickStatsModel>;
}

export type GetQuickStatsModel = GetQuickStatsResponse;

export type GetQuickStatsParams = {
  ano: number;
  mes: number;
};
