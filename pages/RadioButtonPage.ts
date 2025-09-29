import { Page } from "playwright";
import { HelperBase } from "../fixtures/helperBase";
import { expect } from "playwright/test";

const {
  radioButton,
  radioButtonHeader,
  yesRadioButton,
  impressiveRadioButton,
  noRadioButton,
  selectedYesRadioButton,
  selectedImpressiveRadioButton,
} = require("../locators/radioButton.locators");

export class RadioButtonPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async clickOnRadiaoButtonPage() {
    await this.page.locator(radioButton).click();
  }

  async clickOnDifferentRadioButtons() {
    const actualRadioHeader = this.page.locator(radioButtonHeader);
    await expect(actualRadioHeader).toHaveText("Radio Button");

    await this.page.locator(yesRadioButton).click();
    const actualSelectedYesRadioButton = this.page.locator(
      selectedYesRadioButton
    );
    await expect(actualSelectedYesRadioButton).toContainText("Yes");

    await this.page.locator(impressiveRadioButton).click();
    const actualSelectedImpressiveRadioButton = this.page.locator(
      selectedImpressiveRadioButton
    );
    await expect(actualSelectedImpressiveRadioButton).toContainText(
      "Impressive"
    );

    await this.page.locator(noRadioButton).isDisabled();

    await this.waitForNumberOfSeconds(10);
  }
}
