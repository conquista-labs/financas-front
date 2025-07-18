import { PatchMeiosPagamentoId } from "@/data/usecases";
import type { PatchMeiosPagamentoIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchMeiosPagamentoIdFactory =
  (): PatchMeiosPagamentoIdUseCase =>
    new PatchMeiosPagamentoId(
      makeApiUrl("/meios-pagamento/:id"),
      makeAuthorizeHttpClient(),
    );
