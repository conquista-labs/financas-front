import type { DeleteTransacaoResponse } from "@/domain/models";

export interface DeleteTransacoesIdUseCase {
  delete: (param: DeleteTransacoesIdParams) => Promise<DeleteTransacoesIdModel>;
}

export type DeleteTransacoesIdModel = DeleteTransacaoResponse;
export type DeleteTransacoesIdParams = {
  id: string;
  /**
   * Alcance da remoção para compras parceladas. "apenas_esta" (padrão) remove
   * só esta; "esta_e_futuras" remove esta parcela e as seguintes do grupo.
   */
  escopo?: "apenas_esta" | "esta_e_futuras";
};
