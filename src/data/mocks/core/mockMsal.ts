import type { AccountInfo } from "@azure/msal-browser";

import type { MsalClient } from "@/data/protocols";

import { mockAuthenticateResponse } from "./mockAuthenticate";

export class MsalClientSpy implements MsalClient {
  loginCallsCount = 0;
  logoutCallsCount = 0;
  getCurrentAccountCallsCount = 0;

  loginResult = mockAuthenticateResponse();
  logoutParams?: { account: AccountInfo | null };
  currentAccount: AccountInfo | null = mockAuthenticateResponse().account;

  async login(): Promise<typeof this.loginResult> {
    this.loginCallsCount++;
    return this.loginResult;
  }

  async logout(): Promise<void> {
    this.logoutCallsCount++;
  }

  getCurrentAccount(): AccountInfo | null {
    this.getCurrentAccountCallsCount++;
    return this.currentAccount;
  }
}
