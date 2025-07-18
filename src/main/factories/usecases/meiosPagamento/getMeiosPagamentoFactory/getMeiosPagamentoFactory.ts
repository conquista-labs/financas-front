import { GetMeiosPagamento } from "@/data/usecases";
import type { GetMeiosPagamentoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetMeiosPagamentoFactory = (): GetMeiosPagamentoUseCase =>
  new GetMeiosPagamento(
    makeApiUrl("/meios-pagamento"),
    makeAuthorizeHttpClient(),
  );
