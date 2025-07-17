type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

export type HttpRequest = {
  url: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  responseType?: ResponseType;
};
export interface HttpClient {
  request: <R = unknown>(data: HttpRequest) => Promise<HttpResponse<R>>;
}

export type HttpMethod = "post" | "patch" | "get" | "put" | "delete";

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCode;
  body: T;
  message?: string;
};

export type Page = {
  page: number;
  pageSize: number;
  total: number;
};
