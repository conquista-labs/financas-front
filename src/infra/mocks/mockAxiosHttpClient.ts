import * as faker from "@ngneat/falso";
import axios from "axios";
import type { Mocked } from "vitest";

export const mockHttpResponse = (data = faker.randJSON()) => ({
  status: faker.randNumber({ min: 200, max: 599 }),
  data,
});

export const mockAxios = (data = faker.randJSON()): Mocked<typeof axios> => {
  const mockedAxios = axios as Mocked<typeof axios>;
  mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse(data));
  return mockedAxios;
};
