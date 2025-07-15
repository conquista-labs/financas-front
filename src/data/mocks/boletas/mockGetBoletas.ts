import { randNumber } from "@ngneat/falso";

import type { GetBoletasModel, GetBoletasParams } from "@/domain/usecases";

export const mockGetBoletasResponse = (): GetBoletasModel => [];

export const mockGetBoletasRequest = (): GetBoletasParams => ({
  pagina: randNumber(),
  itensPorPagina: randNumber(),
});
