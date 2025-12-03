import type { GetPatrimoniosResponse } from "@/domain/models";

export interface GetPatrimoniosUseCase {
  get: (params: GetPatrimoniosParams) => Promise<GetPatrimoniosModel>;
}

export type GetPatrimoniosModel = GetPatrimoniosResponse;

export type GetPatrimoniosParams = {
  page?: number;
  limit?: number;
  tipo?: "ativo" | "passivo";
  categoria?: string;
};
