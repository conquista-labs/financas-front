import { randWord } from "@ngneat/falso";

import type { GetSelectsBuscaBoletasModel } from "@/domain/usecases";

export const mockSelectOptions = () => ({
  label: randWord(),
  value: randWord(),
});

export const mockGetSelectsBuscaBoletas = (): GetSelectsBuscaBoletasModel => ({
  tipoLoja: [mockSelectOptions()],
  status: [mockSelectOptions()],
  tipoBoleta: [mockSelectOptions()],
  subcategoria: [mockSelectOptions()],
});
