import { GetAnalyticsCategorias } from "@/data/usecases";
import type { GetAnalyticsCategoriasUsecase } from "@/domain/usecases/analytics/getAnalyticsCategorias/getAnalyticsCategorias";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetAnalyticsCategoriasFactory =
  (): GetAnalyticsCategoriasUsecase =>
    new GetAnalyticsCategorias(
      makeApiUrl("/analytics/categorias"),
      makeAuthorizeHttpClient(),
    );
