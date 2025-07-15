import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { makeQueryClient } from "@/app.definitions";
import { mockGetBoletasResponse } from "@/data/mocks";
import { HttpStatusCode } from "@/data/protocols";
import { MswInterceptor } from "@/presentation/mocks";

import { useGetBoletas } from "./useGetBoletas";

const interceptor = new MswInterceptor();

const makeSut = () => {
  const queryClient = makeQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useGetBoletas(), { wrapper });
};

describe(useGetBoletas.name, () => {
  const url = "/v1/boletas";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the data correctly when the query is successful", async () => {
    const mockedResponse = mockGetBoletasResponse();
    interceptor.intercept(url, "get", mockedResponse, HttpStatusCode.ok);
    const { result } = makeSut();

    await interceptor.wait("GET", url);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual({ data: mockedResponse });
  });

  it("should deal correctly with UnexpectedError scenario", async () => {
    interceptor.intercept(url, "get", "", HttpStatusCode.badRequest);

    const { result } = makeSut();
    await interceptor.wait("GET", url);
    await waitFor(() => !result.current.isSuccess);
  });

  it("should deal correctly with unauthorized error scenario", async () => {
    interceptor.intercept(url, "post", "", HttpStatusCode.unauthorized);

    const { result } = makeSut();
    await interceptor.wait("GET", url);
    await waitFor(() => !result.current.isSuccess);
  });
});
