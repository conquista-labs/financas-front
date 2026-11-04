import { PutVincularInvestimentos } from "@/data/usecases";
import type { PutVincularInvestimentosUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePutVincularInvestimentosFactory =
  (): PutVincularInvestimentosUseCase =>
    new PutVincularInvestimentos(
      makeApiUrl("/sincronizacao/investimentos/:patrimonioId"),
      makeAuthorizeHttpClient(),
    );
