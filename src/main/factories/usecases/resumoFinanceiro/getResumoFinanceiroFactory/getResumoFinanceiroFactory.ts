import { GetResumoFinanceiro } from "@/data/usecases";
import type { GetResumoFinanceiroUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetResumoFinanceiroFactory = (): GetResumoFinanceiroUseCase =>
  new GetResumoFinanceiro(
    makeApiUrl("/resumo-financeiro"),
    makeAuthorizeHttpClient(),
  );
