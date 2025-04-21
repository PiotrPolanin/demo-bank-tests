import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.page";
import { LoginData } from "../test-data/login-data";

test.describe("Payment tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    const login = LoginData.userLogin;
    const password = LoginData.userPassword;

    await page.goto("/");
    loginPage = new LoginPage(page);
    await loginPage.login(login, password);
    await page.waitForLoadState("domcontentloaded");
  });

  test("Successful normal payment", async ({ page }) => {
    //Arrange
    const transferReceiver = "Jan Nowak";
    const transferAccount = "12 3456 7890 1234 5678 9012 34568";
    const topupAmount = "250";
    const formTitle = "Przelew zwykły";
    const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
    //Act
    const normalPayment = new PaymentPage(page);
    await normalPayment.openPaymentPage();
    await normalPayment.normalTransfer(
      transferReceiver,
      transferAccount,
      topupAmount,
      formTitle
    );
    //Assert
    await expect(normalPayment.message).toHaveText(message);
  });
});
