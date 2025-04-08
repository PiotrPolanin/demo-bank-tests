import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";


test.describe("Pulpit tests", () => {

  test.beforeEach(async ({page}) => {
    const login = "demo_usr";
    const password = "psw12345";
    
    await page.goto('/');
    const loginPage = new LoginPage(page)
    await loginPage.loginInput.fill(login);
    await loginPage.passwordInput.fill(password);
    await loginPage.loginButton.click();
    await page.waitForLoadState("domcontentloaded");
  });


  test("Sucessfull money rapid transfer", async ({ page }) => {
    // Arrange
    const transferReceiver = "2";
    const transferAmount = "500";
    const transferTitle = "Przelew środków pieniężnych";
    // Act
    await page
      .locator("#widget_1_transfer_receiver")
      .selectOption(transferReceiver);
    await page.locator("#widget_1_transfer_amount").fill(transferAmount);
    await page.locator("#widget_1_transfer_title").fill(transferTitle);
    await page.locator("#execute_btn").click();
    // Assert
    await expect(page.locator("#show_messages")).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - Przelew środków pieniężnych`
    );
  });

  test("Sucessfull money transfer to mobile phone", async ({ page }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "100";
    const message = `Doładowanie wykonane! ${amountToTransfer},00PLN na numer ${phoneNumber}`;
    // Act
    await page.locator("#widget_1_topup_receiver").selectOption(phoneNumber);
    await page.locator("#widget_1_topup_amount").fill(amountToTransfer);
    await page.locator("#uniform-widget_1_topup_agreement").check();
    await page.locator("#execute_phone_btn").click();
    // Assert
    await expect(page.locator("#show_messages")).toHaveText(message);
  });

  test("Balance account is correct after sucessfully transfer money to mobile phone", async ({ page }) => {
    // Arrange
    const phoneNumber = "500 xxx xxx";
    const amountToTransfer = "500";
    const accountBallance = await page.locator('#money_value').innerText();
    const expectBalanceAfterTransfer = Number(accountBallance) - Number(amountToTransfer)

    // Act
    await page.locator("#widget_1_topup_receiver").selectOption(phoneNumber);
    await page.locator("#widget_1_topup_amount").fill(amountToTransfer);
    await page.locator("#uniform-widget_1_topup_agreement").check();
    await page.locator("#execute_phone_btn").click();
    // Assert
    // await expect(page.locator('#money_value')).toHaveText(String(expectBalanceAfterTransfer));
    await expect(page.locator('#money_value')).toHaveText(`${expectBalanceAfterTransfer}`);
  });

});
