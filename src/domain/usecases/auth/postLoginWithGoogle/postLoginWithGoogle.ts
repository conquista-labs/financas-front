import type { GoogleLoginRequest, GoogleLoginResponse } from "@/domain/models";

export interface PostLoginWithGoogleUseCase {
  excute: (
    params: PostLoginWithGoogleRequest,
  ) => Promise<PostLoginWithGoogleModel>;
}

export type PostLoginWithGoogleModel = GoogleLoginResponse;

export type PostLoginWithGoogleRequest = GoogleLoginRequest;
