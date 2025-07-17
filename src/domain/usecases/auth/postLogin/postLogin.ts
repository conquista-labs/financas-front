import type { LoginRequest, LoginResponse } from "@/domain/models";

export interface PostLoginUseCase {
  execute: (body: PostLoginRequest) => Promise<PostLoginModel>;
}

export type PostLoginRequest = LoginRequest;

export type PostLoginModel = LoginResponse;
