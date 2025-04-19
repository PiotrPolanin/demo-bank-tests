import { Locator, Page } from "@playwright/test";

export class LoginPage {
  loginInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  userName: Locator;
  errorLoginMessage: Locator;
  errorPasswordMessage: Locator;

  constructor(private page: Page) {
    this.loginInput = this.page.getByTestId("login-input");
    this.passwordInput = this.page.getByTestId("password-input");
    this.loginButton = this.page.getByTestId("login-button");
    this.userName = this.page.getByTestId("user-name");
    this.errorLoginMessage = page.getByTestId("error-login-id");
    this.errorPasswordMessage = page.getByTestId("error-login-password");
  }

  async login(login: string, password: string): Promise<void>  {
    await this.loginInput.fill(login);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

}
