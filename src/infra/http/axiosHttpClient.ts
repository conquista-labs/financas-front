import axios from "axios";
import qs from "qs";

import {
  type HttpClient,
  type HttpRequest,
  type HttpResponse,
  HttpStatusCode,
} from "@/data/protocols";

export class AxiosHttpClient implements HttpClient {
  async request<T>(data: HttpRequest): Promise<HttpResponse<T>> {
    try {
      const axiosResponse = await axios.request({
        url: data.url,
        method: data.method ?? "get",
        data: data.body,
        headers: data.headers,
        params: data.params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      return {
        statusCode: axiosResponse.status,
        body: axiosResponse.data?.data,
        message: axiosResponse.data?.message ?? "",
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosResponse = error.response;
        return {
          statusCode: axiosResponse?.status ?? HttpStatusCode.serverError,
          body: axiosResponse?.data.data ?? null,
          message: axiosResponse?.data?.message ?? "Unknown error",
        };
      }
      return {
        statusCode: HttpStatusCode.serverError,
        body: null as T,
        message: "An unexpected error occurred",
      };
    }
  }
}
