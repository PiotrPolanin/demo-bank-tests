import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { TransferPage } from "../pages/transfer.page";
import { LoginData } from "../test-data/login-data";
import { DataConverter } from "../utils/DataConverter";

test.describe("Dashboard tests", () => {
  let loginPage: LoginPage;
  const login = LoginData.userLogin;
  const password = LoginData.userPassword;

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    loginPage = new LoginPage(page);
    await loginPage.signIn(login, password);
  });

  test(
    "Successful money rapid transfer",
    {
      tag: ["@payment", "@integration"],
      annotation: {
        type: "happy_path",
        description:
          "Sucessful money rapid transfer with the correct validation message",
      }
    },
    async ({ page }) => {
      // Arrange
      const transferReceiver = "2";
      const transferAmount = "500";
      const transferTitle = "Przelew środków pieniężnych";
      const message = `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - Przelew środków pieniężnych`;
      // Act
      const transferPage = new TransferPage(page);
      await transferPage.rapidMoneyTransfer(
        transferReceiver,
        transferAmount,
        transferTitle
      );
      // Assert
      await expect(transferPage.showTransferMessage).toHaveText(message);
    }
  );

  test(
    "Successful money transfer to mobile phone",
    {
      tag: ["@payment", "@integration"],
      annotation: {
        type: "happy_path",
        description:
          "Sucessful money transfer to mobile phone with the correct validation message",
      }
    },
    async ({ page }) => {
      // Arrange
      const phoneNumber = "500 xxx xxx";
      const amountToTransfer = "100";
      const message = `Doładowanie wykonane! ${amountToTransfer},00PLN na numer ${phoneNumber}`;
      // Act
      const transferPage = new TransferPage(page);
      await transferPage.moneyTransferToMobilePhone(phoneNumber, amountToTransfer);
      // Assert
      await expect(transferPage.showTransferMessage).toHaveText(message);
    }
  );

  test.skip(
    "Balance account is correct after sucessfully transfer money to mobile phone", {
    annotation: {
      type: 'issue',
      description: 'The test historically passed. The total balance is not updating after transfering money by any pay method. The issue is related to changes on tested website',
    }, tag: ["@payment", "@integration"]
  },
    async ({ page }) => {
      // Arrange
      let converter: DataConverter = new DataConverter();
      const phoneNumber = "500 xxx xxx";
      const amountToTransfer = "150";
      const accountBallance = await page.locator("#money_value").innerText();
      const expectBalanceAfterTransfer =
        converter.convertToNumber(accountBallance) - converter.convertToNumber(amountToTransfer);
      // Act
      const transferPage = new TransferPage(page);
      await transferPage.moneyTransferToMobilePhone(phoneNumber, amountToTransfer);
      // Assert
      await expect(transferPage.moneyValue).toHaveText(
        `${expectBalanceAfterTransfer}`
      );
    }
  );
});
