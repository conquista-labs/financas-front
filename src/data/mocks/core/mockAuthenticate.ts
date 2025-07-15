import {
  randBoolean,
  randEmail,
  randFutureDate,
  randState,
  randUserName,
  randUuid,
  randWord,
  randZipCode,
} from "@ngneat/falso";

import type { AuthenticateModel } from "@/domain/usecases";

export const mockAuthenticateResponse = (): AuthenticateModel => ({
  authority: `https://login.microsoftonline.com/${randWord()}`,
  uniqueId: randUuid(),
  tenantId: randUuid(),
  scopes: [randWord(), randWord()],
  account: {
    homeAccountId: randUuid(),
    environment: "login.microsoftonline.com",
    tenantId: randUuid(),
    username: randEmail(),
    localAccountId: randUuid(),
    name: randUserName(),
  },
  idToken: randUuid(),
  idTokenClaims: {
    oid: randUuid(),
    name: randUserName(),
    email: randEmail(),
  },
  accessToken: randUuid(),
  fromCache: randBoolean(),
  expiresOn: randFutureDate(),
  extExpiresOn: randFutureDate(),
  refreshOn: randFutureDate(),
  tokenType: "Bearer",
  correlationId: randUuid(),
  requestId: randUuid(),
  state: randState(),
  familyId: randUuid(),
  cloudGraphHostName: "graph.windows.net",
  msGraphHost: "graph.microsoft.com",
  code: randZipCode(),
  fromNativeBroker: randBoolean(),
});
