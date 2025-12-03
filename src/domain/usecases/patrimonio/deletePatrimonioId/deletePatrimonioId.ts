export interface DeletePatrimonioIdUseCase {
  delete: (params: DeletePatrimonioIdParams) => Promise<void>;
}

export type DeletePatrimonioIdParams = {
  id: string;
};
