import type { DeletePessoaResponse } from "@/domain/models";

export interface DeletePessoasIdUseCase {
  delete: (param: DeletePessoasIdParams) => Promise<DeletePessoasIdModel>;
}

export type DeletePessoasIdModel = DeletePessoaResponse;
export type DeletePessoasIdParams = { id: string };
