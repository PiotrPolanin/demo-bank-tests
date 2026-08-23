import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
  loginInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  userName: Locator;
  errorLoginMessage: Locator;
  errorPasswordMessage: Locator;

  constructor(private page: Page) {
    this.loginInput = this.page.locator("#login_id");
    this.passwordInput = this.page.locator("#login_password");
    this.loginButton = this.page.locator("#login_next");
    this.userName = this.page.locator("#user_name");
    this.errorLoginMessage = page.locator("#error_login_id");
    this.errorPasswordMessage = page.locator("#error_login_password");
  }

  async signIn(login: string, password: string): Promise<void> {
    await this.enterLogin(login);
    await this.clickSignInButton();
    await this.enterPassword(password);
    await this.clickSignInButton();
  }

  async enterLogin(login: string): Promise<void> {
    await expect(this.loginInput).toBeVisible();
    await this.loginInput.fill(login);
    await this.loginInput.blur();
  }

  async enterPassword(password: string): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  async clickSignInButton(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

}
