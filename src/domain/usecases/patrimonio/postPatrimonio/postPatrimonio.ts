import type {
  CreatePatrimonioRequest,
  CreatePatrimonioResponse,
} from "@/domain/models";

export interface PostPatrimonioUseCase {
  post: (body: PostPatrimonioRequest) => Promise<PostPatrimonioModel>;
}

export type PostPatrimonioModel = CreatePatrimonioResponse;
export type PostPatrimonioRequest = CreatePatrimonioRequest;
