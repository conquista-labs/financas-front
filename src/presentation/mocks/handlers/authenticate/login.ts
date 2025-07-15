import { http, HttpResponse } from "msw";

import type { LoginResult } from "@/domain/usecases";
import { ApiRoutes } from "@/presentation/constants";

export const loginMock = http.post(ApiRoutes.LOGIN, async ({ request }) => {
  const { email } = (await request.json()) as LoginResult;

  return HttpResponse.json(
    {
      token: "sample-jwt-token",
      email,
      name: "John Doe",
    },
    {
      status: 200,
      headers: {},
    },
  );
});
