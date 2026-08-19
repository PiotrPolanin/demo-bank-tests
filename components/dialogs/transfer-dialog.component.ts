import { Page, Locator } from "@playwright/test";

export class TransferDialog {
  private dialog: Locator;
  private dialogHeader: Locator;
  private dialogContent: Locator;
  private dialogButton: Locator;

  constructor(private page: Page) {
    this.dialog = page.getByRole("dialog");
    this.dialogHeader = this.dialog.locator("span.ui-dialog-title");
    this.dialogContent = this.dialog.locator("p");
    this.dialogButton = this.dialog.getByTestId("close-button");
  }

  async closeButton(): Promise<void> {
    await this.dialogButton.click();
  }

  getHeader(): Locator {
    return this.dialogHeader;
  }

  getContent(): Locator {
    return this.dialogContent;
  }

  getButton(): Locator {
    return this.dialogButton;
  };

  getDialog(): Locator {
    return this.dialog;
  }
}
