interface Auth {
  access_token: string;
}
export interface AuthProvider {
  getAuth: () => Auth;
  resetAuth: () => void;
}
