import { PostResumoFinanceiro } from "@/data/usecases";
import type { PostResumoFinanceiroUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostResumoFinanceiroFactory =
  (): PostResumoFinanceiroUseCase =>
    new PostResumoFinanceiro(
      makeApiUrl("/resumo-financeiro/:ano"),
      makeAuthorizeHttpClient(),
    );
