import type { PessoaResponseDto } from "@/domain/models";

export interface GetPessoasUseCase {
  get: (params: GetPessoasParams) => Promise<GetPessoasModel>;
}

export type GetPessoasModel = PessoaResponseDto[];

export type GetPessoasParams = {
  pagina?: number;
  itensPorPagina?: number;
};
