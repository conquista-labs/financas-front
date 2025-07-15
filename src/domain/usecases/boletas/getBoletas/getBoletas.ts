// Buscar da pasta models a tipagem correta
// import { ListarBoletasResponseDadosPaginadosResponse } from '@/domain/models'

export interface GetBoletasUseCase {
  get: (params: GetBoletasParams) => Promise<GetBoletasModel>;
}

export type GetBoletasModel = [];

export type GetBoletasParams = {
  pagina?: number;
  itensPorPagina?: number;
};
