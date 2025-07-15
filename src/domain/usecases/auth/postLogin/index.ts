export interface LoginUseCase {
  execute: (params: LoginParams) => Promise<LoginResult>;
}

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  email: string;
  name: string;
};
