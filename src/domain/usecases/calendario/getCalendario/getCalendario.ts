import type { GetCalendarioResponse } from "@/domain/models";

export interface GetCalendarioUseCase {
  get: (params: GetCalendarioParams) => Promise<GetCalendarioModel>;
}

export type GetCalendarioModel = GetCalendarioResponse;

export type GetCalendarioParams = {
  ano: number;
  mes: number;
  categoriaId?: string;
  pessoaId?: string;
  meioPagamentoId?: string;
  tipo?: "receita" | "despesa";
};
