import { PostMeiosPagamento } from "@/data/usecases";
import type { PostMeiosPagamentoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMeiosPagamentoFactory = (): PostMeiosPagamentoUseCase =>
  new PostMeiosPagamento(
    makeApiUrl("/meios-pagamento"),
    makeAuthorizeHttpClient(),
  );
