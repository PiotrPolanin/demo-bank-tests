import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { TransferPage } from "../pages/transfer.page";


test.describe("Pulpit tests", () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({page}) => {
    const login = "demo_usr";
    const password = "psw12345";
    
    await page.goto('/');
    loginPage = new LoginPage(page);
    await loginPage.login(login, password);
    await page.waitForLoadState("domcontentloaded");
  });


  test("Sucessfull money rapid transfer", async ({ page }) => {
    // Arrange
    const transferReceiver = "2";
    const transferAmount = "500";
    const transferTitle = "Przelew środków pieniężnych";
    // Act
    const transferPage = new TransferPage(page)
    await transferPage.transferReceiver
      .selectOption(transferReceiver);
    await transferPage.transferAmount.fill(transferAmount);
    await transferPage.transferTitle.fill(transferTitle);
    await transferPage.transferButton.click();
    // Assert
    await expect(transferPage.showTransferMessage).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - Przelew środków pieniężnych`
    );
  });

  test("Sucessfull money transfer to mobile phone", async ({ page }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "100";
    const message = `Doładowanie wykonane! ${amountToTransfer},00PLN na numer ${phoneNumber}`;
    // Act
    const transferPage = new TransferPage(page);
    await transferPage.topupReceiver.selectOption(phoneNumber);
    await transferPage.topupAmount.fill(amountToTransfer);
    await transferPage.topupAgreement.check();
    await transferPage.phoneButton.click();
    // Assert
    await expect(transferPage.showTransferMessage).toHaveText(message);
  });

  test("Balance account is correct after sucessfully transfer money to mobile phone", async ({ page }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "500";
    const accountBallance = await page.locator('#money_value').innerText();
    const expectBalanceAfterTransfer = Number(accountBallance) - Number(amountToTransfer)
    // Act
    const transferPage = new TransferPage(page);
    await transferPage.topupReceiver.selectOption(phoneNumber);
    await transferPage.topupAmount.fill(amountToTransfer);
    await transferPage.topupAgreement.check();
    await transferPage.phoneButton.click();
    // Assert
    await expect(transferPage.moneyValue).toHaveText(`${expectBalanceAfterTransfer}`);
  });

});
