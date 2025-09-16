import { GetCalendario } from "@/data/usecases";
import type { GetCalendarioUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCalendarioFactory = (): GetCalendarioUseCase =>
  new GetCalendario(
    makeApiUrl("/transacoes/calendario"),
    makeAuthorizeHttpClient(),
  );
