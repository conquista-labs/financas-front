export interface PostResumoFinanceiroUseCase {
  post: (
    params: PostResumoFinanceiroParms,
  ) => Promise<PostResumoFinanceiroModel>;
}

export type PostResumoFinanceiroModel = void;
export type PostResumoFinanceiroParms = { year: number };
