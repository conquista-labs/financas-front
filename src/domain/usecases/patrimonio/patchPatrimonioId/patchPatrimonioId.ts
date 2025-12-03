import type {
  EditPatrimonioRequest,
  EditPatrimonioResponse,
} from "@/domain/models";

export interface PatchPatrimonioIdUseCase {
  patch: (
    params: PatchPatrimonioIdParams,
    body: PatchPatrimonioIdRequest,
  ) => Promise<PatchPatrimonioIdModel>;
}

export type PatchPatrimonioIdModel = EditPatrimonioResponse;
export type PatchPatrimonioIdRequest = EditPatrimonioRequest;

export type PatchPatrimonioIdParams = {
  id: string;
};
