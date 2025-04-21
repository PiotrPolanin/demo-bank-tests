import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { LoginData } from "../test-data/login-data";

test.describe("User login with credentials", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page);
  });

  test(
    "Sucessful login with correct credentials",
    { tag: ["@login", "@smoke"] },
    async ({ page }) => {
      // Arrange
      const login = LoginData.userLogin;
      const password = LoginData.userPassword;
      const userName = "Jan Demobankowy";
      // Act
      await loginPage.login(login, password);
      // Assert
      await expect(loginPage.userName).toHaveText(userName);
    }
  );

  test(
    "Unsucessful login with no filling credentials fields",
    { tag: "@login" },
    async ({ page }) => {
      // Arrange
      const errorMessage = "pole wymagane";
      // Act
      await loginPage.loginInput.click();
      await loginPage.loginInput.blur();
      await loginPage.passwordInput.click();
      await loginPage.passwordInput.blur();
      // Assert
      await expect(loginPage.errorLoginMessage).toHaveText(errorMessage);
      await expect(loginPage.errorPasswordMessage).toHaveText(errorMessage);
    }
  );

  test(
    "Unsucessful login with too short username",
    { tag: "@login" },
    async ({ page }) => {
      // Arrange
      const errorMessage = "identyfikator ma min. 8 znaków";
      // Act
      await loginPage.loginInput.fill("user");
      await loginPage.loginInput.blur();
      // Assert
      await expect(loginPage.errorLoginMessage).toHaveText(errorMessage);
    }
  );

  test(
    "Unsucessful login with too short password",
    { tag: "@login" },
    async ({ page }) => {
      // Arrange
      const login = "tester01";
      const password = "psw1234";
      const errorMessage = "hasło ma min. 8 znaków";
      // Act
      await loginPage.loginInput.fill(login);
      await loginPage.passwordInput.fill(password);
      await loginPage.passwordInput.blur();
      // Assert
      await expect(loginPage.errorPasswordMessage).toHaveText(errorMessage);
    }
  );
});
