import { PostTransacoesPagarLote } from "@/data/usecases";
import type { PostTransacoesPagarLoteUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostTransacoesPagarLoteFactory =
  (): PostTransacoesPagarLoteUseCase =>
    new PostTransacoesPagarLote(
      makeApiUrl("/transacoes/pagar-lote"),
      makeAuthorizeHttpClient(),
    );
