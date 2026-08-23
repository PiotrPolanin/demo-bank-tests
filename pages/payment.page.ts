import { Locator, Page } from "@playwright/test";
import { SideMenuComponent } from "../components/side-menu/side-menu.component";

export class PaymentPage {
  transferReceiver: Locator;
  transferAccount: Locator;
  addressToggle: Locator;
  receiverAddress1: Locator;
  receiverAddress2: Locator;
  receiverAddress3: Locator;
  topupAmount: Locator;
  formTitle: Locator;
  formDate: Locator;
  normalType: Locator;
  expressType: Locator;
  expressForm: Locator;
  transferFee: Locator;
  executeButton: Locator;
  cancelButton: Locator;
  message: Locator;
  emailConfirmation: Locator;
  email: Locator;
  addReceiver: Locator;
  receiverName: Locator;
  receiverTrusted: Locator;
  saveEmailForm: Locator;
  expressTransferTooltip: Locator;
  receiverListTooltip: Locator;
  sideMenu: SideMenuComponent;

  constructor(private page: Page) {
    this.transferReceiver = this.page.locator("#form_receiver");
    this.transferAccount = this.page.locator("#form_account_to");
    this.topupAmount = this.page.locator("#form_amount");
    this.addressToggle = this.page.locator('[data-target="form_address"]').first();
    this.receiverAddress1 = this.page.locator("#form_receiver_address1");
    this.receiverAddress2 = this.page.locator("#form_receiver_address2");
    this.receiverAddress3 = this.page.locator("#form_receiver_address3");
    this.formTitle = this.page.locator("#form_title");
    this.formDate = this.page.locator("#form_date");
    this.normalType = this.page.locator("#form_type1");
    this.expressType = this.page.locator("#form_type2");
    this.transferFee = this.page.locator("#form_fee");
    this.message = this.page.locator("#show_messages");
    this.executeButton = this.page.getByText(/dalej/i);
    this.cancelButton = this.page.getByText(/anuluj/i)
    this.emailConfirmation = this.page.locator("#form_is_email");
    this.email = this.page.locator("#form_email");
    this.addReceiver = this.page.locator("#form_add_receiver");
    this.receiverName = this.page.locator("#form_receiver_name");
    this.receiverTrusted = this.page.locator("#form_trusted");
    this.expressForm = this.page.locator("#form_express");
    this.saveEmailForm = this.page.locator("#form_save_email");
    this.expressTransferTooltip = this.page.locator("#form_express i.i-hint.tooltip");
    this.receiverListTooltip = this.page.locator(".form-row").filter({ has: this.page.locator("#uniform-form_add_receiver") });
    this.sideMenu = new SideMenuComponent(this.page);
  }

  async openPaymentPage(): Promise<void> {
    await this.sideMenu.paymentLink.click();
  }

  async fillNormalTransferForm(
    transferReceiver: string,
    transferAccount: string,
    topupAmount: string,
    formTitle: string,
  ): Promise<void> {
    await this.fillTransferForm(
      transferReceiver,
      transferAccount,
      topupAmount,
      formTitle,
    );
    await this.selectNormalTransferType();
  }

  async fillExpressTransferForm(
    transferReceiver: string,
    transferAccount: string,
    topupAmount: string,
    formTitle: string,
  ): Promise<void> {
    await this.fillTransferForm(
      transferReceiver,
      transferAccount,
      topupAmount,
      formTitle,
    );
    await this.selectExpressTransferType();
  }

  async fillTransferForm(
    transferReceiver: string,
    transferAccount: string,
    topupAmount: string,
    formTitle: string,
  ): Promise<void> {
    await this.transferReceiver.fill(transferReceiver);
    await this.transferAccount.fill(transferAccount);
    await this.topupAmount.fill(topupAmount);
    await this.formTitle.fill(formTitle);
  }

  private async selectNormalTransferType(): Promise<void> {
    await this.normalType.check();
  }

  private async selectExpressTransferType(): Promise<void> {
    await this.expressType.check();
  }

  public async executeTransfer(): Promise<void> {
    await this.executeButton.click();
  }

  public async cancelTransfer(): Promise<void> {
    await this.cancelButton.click();
  }

  public async selectEmailConfirmation(): Promise<void> {
    await this.emailConfirmation.check();
  }

  public async enterEmailConfirmation(email: string): Promise<void> {
    await this.email.fill(email);
  }

  public async addReceiverToList(): Promise<void> {
    await this.addReceiver.check();
  }

  public async enterReceiverName(email: string): Promise<void> {
    await this.receiverName.fill(email);
  }

  public async selectAsTrusted(): Promise<void> {
    await this.receiverTrusted.check();
  }

  async getTransferFee(): Promise<string> {
    return await this.transferFee.innerText();
  }

  public async fillAddressData(line1: string, line2: string, line3: string) {
    // await this.addressToggle.scrollIntoViewIfNeeded();
    await this.addressToggle.click();
    await this.receiverAddress1.fill(line1);
    await this.receiverAddress2.fill(line2);
    await this.receiverAddress3.fill(line3);
  }

  public async showExpressTransferTooltip() {
    await this.expressTransferTooltip.hover();
  }

  public async showReceiverListTooltip() {
    await this.receiverListTooltip.locator('i.i-hint.tooltip').hover();
  }

}
