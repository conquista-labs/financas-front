import type { GetTransacaoResponse } from "@/domain/models";

export interface GetTransacoesIdUseCase {
  get: (params: GetTransacoesIdParams) => Promise<GetTransacoesIdModel>;
}

export type GetTransacoesIdModel = GetTransacaoResponse;

export type GetTransacoesIdParams = {
  id: string;
};
