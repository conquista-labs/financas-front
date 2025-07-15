// Buscar da pasta models a tipagem correta
// import { ListarSelectsBuscaBoletas } from '@/domain/models'

export interface GetSelectsBuscaBoletasUseCase {
  get: () => Promise<GetSelectsBuscaBoletasModel>;
}

export type GetSelectsBuscaBoletasModel = [];
