/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  VincularInvestimentosRequest,
  VincularInvestimentosResponse,
} from "@/domain/models";

export interface PutVincularInvestimentosUseCase {
  put: (
    params: PutVincularInvestimentosParams,
    body: PutVincularInvestimentosRequest,
  ) => Promise<PutVincularInvestimentosModel>;
}

export type PutVincularInvestimentosModel = VincularInvestimentosResponse;
export type PutVincularInvestimentosRequest = VincularInvestimentosRequest;

export type PutVincularInvestimentosParams = {
  patrimonioId: string;
};
