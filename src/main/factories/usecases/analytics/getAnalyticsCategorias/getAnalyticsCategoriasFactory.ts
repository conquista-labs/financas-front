import { GetAnalyticsCategorias } from "@/data/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";
import { GetAnalyticsCategoriasUsecase } from "@/domain/usecases/analytics/getAnalyticsCategorias/getAnalyticsCategorias";

export const makeGetAnalyticsCategoriasFactory =
  (): GetAnalyticsCategoriasUsecase =>
    new GetAnalyticsCategorias(
      makeApiUrl("/analytics/categorias"),
      makeAuthorizeHttpClient(),
    );
