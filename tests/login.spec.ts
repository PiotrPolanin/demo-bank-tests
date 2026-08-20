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
    {
      tag: ["@login", "@smoke"],
      annotation: {
        type: "happy_path",
        description:
          "Sucessful login using correct and valid login and password.",
      },
    },
    async ({ page }) => {
      // Arrange
      const login = LoginData.userLogin;
      const password = LoginData.userPassword;
      const userName = "Jan Demobankowy";
      // Act
      await loginPage.enterLoginAndPassword(login, password);
      // Assert
      await expect(loginPage.userName).toHaveText(userName);
    }
  );

  test(
    "Unsucessful login with no filling login field",
    {
      tag: "@login",
      annotation: {
        type: "unhappy_path",
        description:
          "Unsucessful login with no filling login field.",
      },
    },
    async ({ page }) => {
      // Arrange
      const errorMessage = "pole wymagane";
      // Act
      await loginPage.enterLogin("");
      // Assert
      await expect(loginPage.errorLoginMessage).toHaveText(errorMessage);
      await expect(loginPage.loginButton).toBeDisabled();
    }
  );

  test(
    "Unsucessful login with no filling password field",
    {
      tag: "@login",
      annotation: {
        type: "unhappy_path",
        description:
          "Unsucessful login with no filling password field.",
      },
    },
    async ({ }) => {
      // Arrange
      const login = LoginData.userLogin;
      const errorMessage = "pole wymagane";
      // Act
      await loginPage.enterLogin(login);
      await loginPage.clickSignInButton();
      await loginPage.enterPassword("");
      // Assert
      await expect(loginPage.errorPasswordMessage).toHaveText(errorMessage);
      await expect(loginPage.loginButton).toBeDisabled();
    }
  );

  test(
    "Unsucessful login with too short username",
    {
      tag: "@login",
      annotation: {
        type: "unhappy_path",
        description:
          "Unsucessful login with too short username causing displaying error message under login field. Username should have at least 8 characters.",
      },
    },
    async ({ page }) => {
      // Arrange
      const errorMessage = "identyfikator ma min. 8 znaków";
      // Act
      await loginPage.enterLogin("user");
      // Assert
      await expect(loginPage.errorLoginMessage).toHaveText(errorMessage);
      await expect(loginPage.loginButton).toBeDisabled();
    }
  );

  test(
    "Unsucessful login with too short password",
    {
      tag: "@login",
      annotation: {
        type: "unhappy_path",
        description:
          "Unsucessful login with too short password causing displaying error message under password field. Password should have at least 8 characters.",
      },
    },
    async ({ page }) => {
      // Arrange
      const login = "tester01";
      const password = "psw1234";
      const errorMessage = "hasło ma min. 8 znaków";
      // Act
      await loginPage.enterLogin(login);
      await loginPage.clickSignInButton();
      await loginPage.enterPassword(password);
      // Assert
      await expect(loginPage.errorPasswordMessage).toHaveText(errorMessage);
      await expect(loginPage.loginButton).toBeDisabled();
    }
  );
});
