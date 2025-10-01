import { GetQuickStats } from "@/data/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";
import { GetQuickStatsUsecase } from "@/domain/usecases/analytics/getQuickStats/getQuickStats";

export const makeGetQuickStatsFactory = (): GetQuickStatsUsecase =>
  new GetQuickStats(
    makeApiUrl("/analytics/quick-stats"),
    makeAuthorizeHttpClient(),
  );
