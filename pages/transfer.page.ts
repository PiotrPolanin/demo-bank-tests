import { Locator, Page } from "@playwright/test";

export class TransferPage {
    transferReceiver: Locator;
    transferAmount: Locator;
    transferTitle: Locator;
    transferButton: Locator;
    showTransferMessage: Locator;
    topupReceiver: Locator;
    topupAmount: Locator;
    topupAgreement: Locator;
    phoneButton: Locator;
    moneyValue: Locator;

    constructor(private page: Page) {
        this.transferReceiver = this.page.locator("#widget_1_transfer_receiver");
        this.transferAmount = this.page.locator("#widget_1_transfer_amount");
        this.transferTitle = this.page.locator("#widget_1_transfer_title");
        this.transferButton = this.page.locator("#execute_btn");
        this.showTransferMessage = this.page.locator("#show_messages");
        this.topupReceiver = this.page.locator("#widget_1_topup_receiver");
        this.topupAmount = this.page.locator("#widget_1_topup_amount");
        this.topupAgreement = this.page.locator("#uniform-widget_1_topup_agreement");
        this.phoneButton = this.page.locator("#execute_phone_btn");
        this.moneyValue = this.page.locator("#money_value");
    }
}