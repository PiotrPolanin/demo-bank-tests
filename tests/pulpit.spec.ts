import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { TransferPage } from "../pages/transfer.page";
import { LoginData } from "../test-data/login-data";

test.describe("Pulpit tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    const login = LoginData.userLogin;
    const password = LoginData.userPassword;

    await page.goto("/");
    loginPage = new LoginPage(page);
    await loginPage.login(login, password);
    await page.waitForLoadState("domcontentloaded");
  });

  test("Successful money rapid transfer @payment @integration", async ({ page }) => {
    // Arrange
    const transferReceiver = "2";
    const transferAmount = "500";
    const transferTitle = "Przelew środków pieniężnych";
    // Act
    const transferPage = new TransferPage(page);
    transferPage.rapidMoneyTransfer(
      transferReceiver,
      transferAmount,
      transferTitle
    );
    // Assert
    await expect(transferPage.showTransferMessage).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - Przelew środków pieniężnych`
    );
  });

  test("Successful money transfer to mobile phone @payment @integration", async ({ page }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "100";
    const message = `Doładowanie wykonane! ${amountToTransfer},00PLN na numer ${phoneNumber}`;
    // Act
    const transferPage = new TransferPage(page);
    transferPage.moneyTransferToMobilePhone(phoneNumber, amountToTransfer);
    // Assert
    await expect(transferPage.showTransferMessage).toHaveText(message);
  });

  test("Balance account is correct after sucessfully transfer money to mobile phone @payment @integration", async ({
    page,
  }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "500";
    const accountBallance = await page.locator("#money_value").innerText();
    const expectBalanceAfterTransfer =
      Number(accountBallance) - Number(amountToTransfer);
    // Act
    const transferPage = new TransferPage(page);
    transferPage.moneyTransferToMobilePhone(phoneNumber, amountToTransfer);
    // Assert
    await expect(transferPage.moneyValue).toHaveText(
      `${expectBalanceAfterTransfer}`
    );
  });
});
