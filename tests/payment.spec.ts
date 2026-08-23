import { test, expect, Locator } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.page";
import { TransferDialog } from "../components/dialogs/transfer-dialog.component";
import { LoginData } from "../test-data/login-data";
import { DataConverter } from "../utils/DataConverter";
import { MathFunctions } from "../utils/MathFunctions";
import { DataFormatter } from "../utils/DataFormatter";

test.describe("Payment tests", () => {
  let loginPage: LoginPage;
  let paymentPage: PaymentPage;
  let converter: DataConverter = new DataConverter();
  let functions: MathFunctions = new MathFunctions();
  let formatter: DataFormatter = new DataFormatter();
  let accountBalanceBeforeTransfer: Locator;
  let accountBalanceAfterTransfer: Locator;

  test.beforeEach(async ({ page }) => {
    const login = LoginData.userLogin;
    const password = LoginData.userPassword;

    await page.goto("/", { waitUntil: "domcontentloaded" });
    loginPage = new LoginPage(page);
    await loginPage.signIn(login, password);
    paymentPage = new PaymentPage(page);
    paymentPage.openPaymentPage();
    accountBalanceBeforeTransfer = page.locator("#form_account_amount");
    accountBalanceAfterTransfer = page.locator("#form_after_transfer");
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
      // const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
      const message = `Przelew Udany`;
      const expectedAccountBalanceBeforeTransfer = await accountBalanceBeforeTransfer.innerText();
      const convAccountBalance = converter.convertToNumber(expectedAccountBalanceBeforeTransfer);
      const convTopupAmount = converter.convertToNumber(topupAmount);
      const transferFee = converter.convertToNumber(
        await paymentPage.getTransferFee(),
      );
      const expectedAccountBalanceAfterTransfer =
        calculateAccountBalanceAfterTransfer(
          convAccountBalance,
          convTopupAmount,
          transferFee,
        );
      //Act
      await paymentPage.fillNormalTransferForm(
        transferReceiver,
        transferAccount,
        topupAmount,
        formTitle,
      );
      //Assert
      await expect(accountBalanceBeforeTransfer).toHaveText(expectedAccountBalanceBeforeTransfer);
      await expect(accountBalanceAfterTransfer).toHaveText(expectedAccountBalanceAfterTransfer);
      await expect(paymentPage.transferFee).toHaveText("0,00");
      //Act
      paymentPage.executeTransfer();
      //Assert
      await expect(paymentPage.message).toHaveText(message);
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
      // const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
      const message = `Przelew Udany`;
      const expectedAccountBalanceBeforeTransfer = await accountBalanceBeforeTransfer.innerText();
      const convAccountBalance = converter.convertToNumber(expectedAccountBalanceBeforeTransfer);
      const convTopupAmount = converter.convertToNumber(topupAmount);
      const transferFee = converter.convertToNumber(
        await paymentPage.getTransferFee(),
      );
      const expectedAccountBalanceAfterTransfer =
        calculateAccountBalanceAfterTransfer(
          convAccountBalance,
          convTopupAmount,
          transferFee,
        );
      await paymentPage.fillExpressTransferForm(
        transferReceiver,
        transferAccount,
        topupAmount,
        formTitle,
      );
      //Assert
      await expect(accountBalanceBeforeTransfer).toHaveText(expectedAccountBalanceBeforeTransfer);
      await expect(accountBalanceAfterTransfer).toHaveText(expectedAccountBalanceAfterTransfer);
      await expect(paymentPage.transferFee).toHaveText("5,00");
      //Act
      paymentPage.executeTransfer();
      //Assert
      await expect(paymentPage.message).toHaveText(message);
    },
  );

  function calculateAccountBalanceAfterTransfer(
    accountBalance: number,
    topupAmount: number,
    transferFee: number,
  ): string {
    return formatter.formatNumber(
      functions.roundToTwoDecimals(
        accountBalance - topupAmount - transferFee,
      )
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

  test.skip(
    "Verifing error message for required fields are empty when execute payment is triggered",
    {
      tag: ["@payment", "@integration"], annotation: {
        type: "issue",
        description: "The test historically passed. The issue is related to changes in progresson on tested website"
      }
    },
    async ({ page }) => {
      //Arrange
      const errorMessageIds = [
        "#error_widget_4_transfer_receiver",
        "#error_widget_2_transfer_account",
        "#error_widget_1_topup_amount", "#error_form_title"
      ];
      const errorMessage = "pole wymagane";
      //Act
      await paymentPage.fillNormalTransferForm("", "", "", "");
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
    // const message = `Przelew wykonany! ${topupAmount},00PLN dla ${transferReceiver}`;
    const message = `Przelew Udany`;
    const email = "mark.smith@example.com"
    //Act
    await paymentPage.selectEmailConfirmation();
    await paymentPage.enterEmailConfirmation(email);
    await paymentPage.addReceiverToList();
    await paymentPage.enterReceiverName(transferReceiver);
    await paymentPage.selectAsTrusted();
    //Assert
    await expect(paymentPage.emailConfirmation).toBeChecked();
    await expect(paymentPage.email).toHaveValue(email);
    await expect(paymentPage.addReceiver).toBeChecked();
    await expect(paymentPage.receiverName).toHaveValue(transferReceiver);
    await expect(paymentPage.receiverTrusted).toBeChecked();
    //Act
    await paymentPage.fillNormalTransferForm(transferReceiver, transferAccount, topupAmount, formTitle);
    await paymentPage.executeTransfer();
    //Assert
    await expect(paymentPage.message).toHaveText(message);
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
    //Act
    await paymentPage.selectEmailConfirmation();
    await paymentPage.addReceiverToList();
    await paymentPage.fillTransferForm(transferReceiver, transferAccount, topupAmount, formTitle);
    await paymentPage.fillAddressData(addressLine1, addressLine2, addressLine3);
    await paymentPage.cancelTransfer();
    //Assert
    await expect(paymentPage.transferReceiver).toHaveAttribute("placeholder", "wpisz nazwę odbiorcy przelewu lub wybierz z listy");
    await expect(paymentPage.transferAccount).toHaveAttribute("placeholder", "__ ____ ____ ____ ____ ____ ____");
    await expect(paymentPage.receiverAddress1).toHaveAttribute("placeholder", "ulica i numer domu / mieszkania");
    await expect(paymentPage.receiverAddress2).toHaveAttribute("placeholder", "kod pocztowy, miejscowość");
    await expect(paymentPage.receiverAddress3).toHaveAttribute("placeholder", "adres - trzecia linia");
    await expect(paymentPage.topupAmount).toBeEmpty();
    await expect(paymentPage.formTitle).toHaveValue("przelew środków");
    await expect(paymentPage.normalType).toBeChecked();
    await expect(paymentPage.emailConfirmation).not.toBeChecked();
    await expect(paymentPage.addReceiver).not.toBeChecked();
    await expect(paymentPage.transferFee).toHaveText("0,00");
  });

  test("Tooltips are displayed", { tag: ["@payment", "@integration"] }, async ({ page }) => {
    //Arrange
    const expressTransferTooltipMsg = /Przelew realizowany nawet w 15 minut za pośrednictwem operatora Blue Media S.A./;
    const receiverListTooltipMsg = /Możesz zapisać odbiorcę do "listy odbiorców". Odbiorca może zostać również zapisany na liście jako "zaufany" dzięki czemu następne przelewy nie będą wymagały dodatkowej autoryzacji./;
    const payment = new PaymentPage(page);
    await payment.openPaymentPage();
    //Act                    
    await paymentPage.showExpressTransferTooltip();
    await paymentPage.showReceiverListTooltip();
    //Assert                    
    await expect(paymentPage.expressTransferTooltip).toContainText(expressTransferTooltipMsg);
    await expect(paymentPage.receiverListTooltip).toContainText(receiverListTooltipMsg);
  });

});
