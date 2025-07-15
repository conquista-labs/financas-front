import type { LoginDto } from "@/domain/models";

export interface PostLoginUseCase {
  execute: (body: PostLoginRequest) => Promise<PostLoginModel>;
}

export type PostLoginRequest = LoginDto;

export type PostLoginModel = {
  access_token: string;
};
