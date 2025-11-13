export interface PostLogoutGoogleUseCase {
  excute: () => Promise<PostLogoutGoogleModel>;
}

export type PostLogoutGoogleModel = {
  message: string;
  data: null;
};
