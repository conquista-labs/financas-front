export interface PostResumoFinanceiroUseCase {
  post: () => Promise<PostResumoFinanceiroModel>;
}

export type PostResumoFinanceiroModel = void;
