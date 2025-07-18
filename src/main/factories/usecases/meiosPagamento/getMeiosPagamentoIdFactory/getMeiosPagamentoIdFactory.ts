import { GetMeiosPagamentoId } from "@/data/usecases";
import type { GetMeiosPagamentoIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetMeiosPagamentoIdFactory = (): GetMeiosPagamentoIdUseCase =>
  new GetMeiosPagamentoId(
    makeApiUrl("/meios-pagamento/:id"),
    makeAuthorizeHttpClient(),
  );
