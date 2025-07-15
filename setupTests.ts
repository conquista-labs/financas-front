import "@testing-library/jest-dom";

import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import { server } from "./src/presentation/mocks";

beforeEach(() => server.events.removeAllListeners());
beforeAll(() => server.listen());
afterEach(() => {
  server.restoreHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());
