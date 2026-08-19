import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.page";
import { TransferDialog } from "../components/dialogs/transfer-dialog.component";
import { LoginData } from "../test-data/login-data";
import { DataConverter } from "../utils/DataConverter";
import { MathFunctions } from "../utils/MathFunctions";
import { DataFormatter } from "../utils/DataFormatter";

test.describe("Payment tests", () => {
  let loginPage: LoginPage;
  let converter: DataConverter = new DataConverter();
  let functions: MathFunctions = new MathFunctions();
  let formatter: DataFormatter = new DataFormatter();

  test.beforeEach(async ({ page }) => {
    const login = LoginData.userLogin;
    const password = LoginData.userPassword;

    await page.goto("/");
    loginPage = new LoginPage(page);
    await loginPage.login(login, password);
    await page.waitForLoadState("domcontentloaded");
  });

  test(
    "Successful normal payment with current date",
    { tag: ["@payment", "@integration"] },
    async ({ page }) => {
      //Arrange
      const transferReceiver = "Jan Nowak";
      const transferAccount = "12 3456 7890 1234 5678 9012 34568";
      const topupAmount = "259";
      const formTitle = "Przelew zwykły";
      const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
      const normalPayment = new PaymentPage(page);
      const transferDialog = new TransferDialog(page);
      //Act
      await normalPayment.openPaymentPage();
      const accountBalance = await page
        .locator("#form_account_amount")
        .innerText();
      const convAccountBalance = converter.convertToNumber(accountBalance);
      const convTopupAmount = converter.convertToNumber(topupAmount);
      const transferFee = converter.convertToNumber(
        await normalPayment.getTransferFee(),
      );
      const expectedAccountBalanceAfterTransfer =
        calculateAccountBalanceAfterTransfer(
          convAccountBalance,
          convTopupAmount,
          transferFee,
        );

      await normalPayment.normalTransfer(
        transferReceiver,
        transferAccount,
        topupAmount,
        formTitle,
      );

      //Assert
      await transferDialogValidation(
        transferDialog,
        transferReceiver,
        topupAmount,
      );
      await expect(normalPayment.message).toHaveText(message);
      await expect(page.locator("#form_account_amount")).toHaveText(
        expectedAccountBalanceAfterTransfer,
      );
      await expect(normalPayment.transferFee).toHaveText("0,00");
    },
  );

  test(
    "Successful express payment with current date",
    { tag: ["@payment", "@integration"] },
    async ({ page }) => {
      //Arrange
      const transferReceiver = "John Doe";
      const transferAccount = "12 6543 0987 4321 8765 2109 86543";
      const topupAmount = "399";
      const formTitle = "Przelew ekspresowy";
      const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
      const expressPayment = new PaymentPage(page);
      const transferDialog = new TransferDialog(page);
      //Act
      await expressPayment.openPaymentPage();
      const accountBalance = await page
        .locator("#form_account_amount")
        .innerText();
      const convAccountBalance = converter.convertToNumber(accountBalance);
      const convTopupAmount = converter.convertToNumber(topupAmount);
      const transferFee = converter.convertToNumber(
        await expressPayment.getTransferFee(),
      );
      const expectedAccountBalanceAfterTransfer =
        calculateAccountBalanceAfterTransfer(
          convAccountBalance,
          convTopupAmount,
          transferFee,
        );
      await expressPayment.expressTransfer(
        transferReceiver,
        transferAccount,
        topupAmount,
        formTitle,
      );

      //Assert
      await transferDialogValidation(
        transferDialog,
        transferReceiver,
        topupAmount,
      );
      await expect(expressPayment.message).toHaveText(message);
      await expect(page.locator("#form_account_amount")).toHaveText(
        expectedAccountBalanceAfterTransfer,
      );
      await expect(expressPayment.transferFee).toHaveText("5,00");
    },
  );

  function calculateAccountBalanceAfterTransfer(
    accountBalance: number,
    topupAmount: number,
    transferFee: number,
  ): string {
    return formatter.formatNumber(
      functions.round(
        functions.roundToTwoDecimals(
          accountBalance - topupAmount - transferFee,
        ),
      ),
    );
  }

  async function transferDialogValidation(
    dialog: TransferDialog,
    receiver: string,
    amount: string,
  ): Promise<void> {
    await expect(dialog.getDialog()).toBeVisible();
    await expect(dialog.getHeader()).toHaveText("Przelew wykonany");
    const transferDialogContent = dialog.getContent();
    await expect(transferDialogContent).toContainText("Przelew wykonany!");
    await expect(transferDialogContent).toContainText(`Odbiorca: ${receiver}`);
    await expect(transferDialogContent).toContainText(`Kwota: ${amount},00PLN`);
    await expect(dialog.getButton()).toBeVisible();
    await dialog.getButton().click();
    await expect(dialog.getDialog()).toBeHidden();
  }

  test(
    "Verifing error message for required fields are empty when execute payment is triggered",
    { tag: ["@payment", "@integration"] },
    async ({ page }) => {
      //Arrange
      const errorMessageIds = [
        "#error_widget_4_transfer_receiver",
        "#error_widget_2_transfer_account",
        "#error_widget_1_topup_amount", "#error_form_title"
      ];
      const errorMessage = "pole wymagane";
      //Act
      const paymentPage = new PaymentPage(page);
      await paymentPage.openPaymentPage();
      await paymentPage.normalTransfer("", "", "", "");
      //Assert
      for (const errorMgsId of errorMessageIds) {
        await expect(page.locator(errorMgsId)).toBeVisible();
        await expect(page.locator(errorMgsId)).toHaveText(errorMessage);
      }
    });

  test("Successful normal payment with current date, email confirmation and added trusted receiver to the list", { tag: ["@payment", "@integration"] }, async ({ page }) => {
    //Arrange
    const transferReceiver = "Mark Smith";
    const transferAccount = "12 6543 0987 4321 8765 2109 86543";
    const topupAmount = "1000";
    const formTitle = "Przelew zwykly";
    const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
    const email = "mark.smith@example.com"
    const payment = new PaymentPage(page);
    //Act
    await payment.openPaymentPage();
    await payment.selectEmailConfirmation();
    await payment.enterEmailConfirmation(email);
    await payment.addReceiverToList();
    await payment.enterReceiverName(transferReceiver);
    await payment.selectAsTrusted();
    await payment.normalTransfer(transferReceiver, transferAccount, topupAmount, formTitle);
    //Assert
    await expect(payment.message).toHaveText(message);
    await expect(payment.emailConfirmation).toBeChecked();
    await expect(payment.email).toHaveValue(email);
    await expect(payment.addReceiver).toBeChecked();
    await expect(payment.receiverName).toHaveValue(transferReceiver);
    await expect(payment.receiverTrusted).toBeChecked();
  });

  test("Values in the payment form got default values when cancel button was clicked", { tag: ["@payment", "@integration"] }, async ({ page }) => {
    //Arrange
    const transferReceiver = "Richard Mc Bride";
    const transferAccount = "12 6543 0987 4321 8765 2109 86543";
    const topupAmount = "2000";
    const formTitle = "Przelew ekspresowy";
    const addressLine1 = "Address Line 1";
    const addressLine2 = "Address Line 2";
    const addressLine3 = "Address Line 3";
    const payment = new PaymentPage(page);
    //Act
    await payment.openPaymentPage();
    await payment.selectEmailConfirmation();
    await payment.addReceiverToList();
    await payment.fillTransferForm(transferReceiver, transferAccount, topupAmount, formTitle);
    await payment.fillAddressData(addressLine1, addressLine2, addressLine3);
    await payment.cancelTransfer();
    //Assert
    await expect(payment.transferReceiver).toHaveAttribute("placeholder", "wpisz nazwę odbiorcy przelewu");
    await expect(payment.transferAccount).toHaveAttribute("placeholder", "__ ____ ____ ____ ____ ____ ____");
    await expect(payment.receiverAddress1).toHaveAttribute("placeholder", "ulica i numer domu / mieszkania");
    await expect(payment.receiverAddress2).toHaveAttribute("placeholder", "kod pocztowy, miejscowość");
    await expect(payment.receiverAddress3).toHaveAttribute("placeholder", "adres - trzecia linia");
    await expect(payment.topupAmount).toBeEmpty();
    await expect(payment.formTitle).toHaveValue("przelew środków");
    await expect(payment.normalType).toBeChecked();
    await expect(payment.emailConfirmation).not.toBeChecked();
    await expect(payment.addReceiver).not.toBeChecked();
    await expect(payment.transferFee).toHaveText("0,00");
  });

  test("Tooltips are displayed", {tag: ["@payment", "@integration"]}, async({page}) => {
    //Arrange
    const expressTransferTooltipMsg = /Przelew realizowany nawet w 15 minut za pośrednictwem operatora Blue Media S.A./;
    const receiverListTooltipMsg = /Możesz zapisać odbiorcę do "listy odbiorców". Odbiorca może zostać również zapisany na liście jako "zaufany" dzięki czemu następne przelewy nie będą wymagały dodatkowej autoryzacji./;
    const payment = new PaymentPage(page);
    await payment.openPaymentPage();
    //Act                    
    await payment.showExpressTransferTooltip();
    await payment.showReceiverListTooltip();
    //Assert                    
    await expect(payment.expressTransferTooltip).toContainText(expressTransferTooltipMsg);
    await expect(payment.receiverListTooltip).toContainText(receiverListTooltipMsg);
  });

});
