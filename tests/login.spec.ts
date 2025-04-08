import { test, expect } from "@playwright/test";

test.describe("User login with credentials", () => {

  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test("Sucessful login with correct credentials", async ({ page }) => {
    // Arrange
    const login = "demo_usr";
    const password = "psw12345";
    const userName = "Jan Demobankowy";
    // Act
    await page.getByTestId("login-input").fill(login);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-button").click();
    // Assert
    await expect(page.getByTestId("user-name")).toHaveText(userName);
  });

  test("Unsucessful login with no filling credentials fields", async ({
    page,
  }) => {
    // Arrange
    const errorMessage = "pole wymagane";
    // Act
    await page.getByTestId("login-input").click();
    await page.getByTestId("login-input").blur();
    await page.getByTestId("password-input").click();
    await page.getByTestId("password-input").blur();
    // Assert
    await expect(page.getByTestId("error-login-id")).toHaveText(errorMessage);
    await expect(page.getByTestId("error-login-password")).toHaveText(
      errorMessage
    );
  });

  test("Unsucessful login with too short username", async ({ page }) => {
    // Arrange
    const errorMessage = "identyfikator ma min. 8 znaków";
    // Act
    await page.getByTestId("login-input").fill("user");
    await page.getByTestId("login-input").blur();
    // Assert
    await expect(page.getByTestId("error-login-id")).toHaveText(errorMessage);
  });

  test("Unsucessful login with too short password", async ({ page }) => {
    // Arrange
    const login = "tester01";
    const password = "psw1234";
    const errorMessage = "hasło ma min. 8 znaków";
    // Act
    await page.getByTestId("login-input").fill(login);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("password-input").blur();
    // Assert
    await expect(page.getByTestId("error-login-password")).toHaveText(
      errorMessage
    );
  });
});
