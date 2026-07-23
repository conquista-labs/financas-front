import { GetQuickStats } from "@/data/usecases";
import type { GetQuickStatsUsecase } from "@/domain/usecases/analytics/getQuickStats/getQuickStats";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetQuickStatsFactory = (): GetQuickStatsUsecase =>
  new GetQuickStats(
    makeApiUrl("/analytics/quick-stats"),
    makeAuthorizeHttpClient(),
  );
