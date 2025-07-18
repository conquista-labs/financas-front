import { DeleteMeiosPagamentoId } from "@/data/usecases";
import type { DeleteMeiosPagamentoIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteMeiosPagamentoIdFactory =
  (): DeleteMeiosPagamentoIdUseCase =>
    new DeleteMeiosPagamentoId(
      makeApiUrl("/meios-pagamento/:id"),
      makeAuthorizeHttpClient(),
    );
