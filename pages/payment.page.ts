import { Locator, Page } from "@playwright/test";
import { SideMenuComponent } from "../components/side-menu.component";

export class PaymentPage {
  transferReceiver: Locator;
  transferAccount: Locator;
  topupAmount: Locator;
  formTitle: Locator;
  formDate: Locator;
  formTypeOne: Locator;
  formTypeTwo: Locator;
  button: Locator;
  message: Locator;
  sideMenu: SideMenuComponent;

  constructor(private page: Page) {
    this.transferReceiver = this.page.locator("#widget_4_transfer_receiver");
    this.transferAccount = this.page.locator("#widget_2_transfer_account");
    this.topupAmount = this.page.locator("#widget_1_topup_amount");
    this.formTitle = this.page.locator("#form_title");
    this.formDate = this.page.locator("#form_date");
    this.formTypeOne = this.page.locator("#form_type1");
    this.formTypeTwo = this.page.locator("#form_type2");
    this.message = this.page.locator("#show_messages");
    this.button = this.page.locator("#execute_btn");
    this.sideMenu = new SideMenuComponent(this.page);
  }

  async openPaymentPage(): Promise<void> {
    this.sideMenu.paymentLink.click();
  }

  async normalTransfer(
    transferReceiver: string,
    transferAccount: string,
    topupAmount: string,
    formTitle: string
  ): Promise<void> {
    await this.transferReceiver.fill(transferReceiver);
    await this.transferAccount.fill(transferAccount);
    await this.topupAmount.fill(topupAmount);
    await this.formTitle.fill(formTitle);
    await this.formTypeOne.check();
    await this.button.click();
  }
}
