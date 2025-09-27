import { expect } from "playwright/test";
import { HelperBase } from "../fixtures/helperBase";
import { Page } from "playwright";

const {
  checkBox,
  checkBoxHeader,
  checkBoxBox,
  selectedCheckBox,
} = require("../locators/checkBox.locators");

export class CheckBoxPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async clickOnCheckBox() {
    await this.page.locator(checkBox).click();

    const actualCheckBoxHeader = this.page.locator(checkBoxHeader);
    await expect(actualCheckBoxHeader).toHaveText("Check Box");

    await this.page.locator(checkBoxBox).click();

    const actualSelectedCheckBoxText = this.page.locator(selectedCheckBox);
    await expect(actualSelectedCheckBoxText).toContainText(
      "You have selected :"
    );
    await this.waitForNumberOfSeconds(10);
  }
}
