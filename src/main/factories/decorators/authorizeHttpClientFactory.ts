import type { AxiosHttpClient } from "@/infra/http";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { makeZustandAuthProviderFactory } from "@/main/factories/adapters";
import { makeAxiosHttpClient } from "@/main/factories/http";

export const makeAuthorizeHttpClient = (): AxiosHttpClient => {
  return new AuthorizeHttpClientDecorator(
    makeAxiosHttpClient(),
    makeZustandAuthProviderFactory(),
  );
};
