import { GetRelatorioTransacoes } from "@/data/usecases";
import type { GetRelatorioTransacoesUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetRelatorioTransacoesFactory =
  (): GetRelatorioTransacoesUseCase =>
    new GetRelatorioTransacoes(
      makeApiUrl("/relatorios/transacoes"),
      makeAuthorizeHttpClient(),
    );
