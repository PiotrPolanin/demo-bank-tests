import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { TransferPage } from "../pages/transfer.page";
import { PaymentPage } from "../pages/payment.page";
import { only } from "node:test";


test.describe("Payment tests", () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({page}) => {
    const login = "demo_usr";
    const password = "psw12345";
    
    await page.goto('/');
    loginPage = new LoginPage(page);
    await loginPage.login(login, password);
    await page.waitForLoadState("domcontentloaded");
  });

  test("Successful normal payment", async ({page}) => {
    //Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccount = '12 3456 7890 1234 5678 9012 34568';
    const topupAmount = '250';
    const formTitle = 'Przelew zwykły';
    const formDate = '17.04.2025';
    const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
    //Act
    const normalPayment = new PaymentPage(page);
    await normalPayment.sideMenu.paymentLink.click();
    await normalPayment.transferReceiver.fill(transferReceiver);
    await normalPayment.transferAccount.fill(transferAccount);
    await normalPayment.topupAmount.fill(topupAmount);
    await normalPayment.formTitle.fill(formTitle);
    await normalPayment.formTypeOne.check();

    await normalPayment.button.click();
    //Assert
    await expect(normalPayment.message).toHaveText(message);
  });

});