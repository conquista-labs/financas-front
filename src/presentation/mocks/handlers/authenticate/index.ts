import type { RequestHandler, WebSocketHandler } from "msw";

import { loginMock } from "./login";

export const authenticateMocksHandlers: Array<
  RequestHandler | WebSocketHandler
> = [loginMock];
