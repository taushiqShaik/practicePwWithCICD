import { expect, Page } from "@playwright/test";
import { HelperBase } from "../fixtures/helperBase";

const {
  buttons,
  doubleClickBtn,
  doubleClickMessage,
  rightClickBtn,
  rightClickMessage,
  dynamicClickBtn,
  dynamicClickMessage,
  buttonsHeader,
} = require("../locators/buttons.locators.ts");

export class ButtonsPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async checkButtonsHeader() {
    await this.page.locator(buttons).click();
    const actualButtonsHeader = this.page.locator(buttonsHeader);
    await expect(actualButtonsHeader).toHaveText("Buttons");

    const headerText = await actualButtonsHeader.textContent();
    console.log(headerText);
    console.log("2");
  }

  async doubleClickButton() {
    await this.page.locator(doubleClickBtn).dblclick();
    const actualDoubleClickMessage = this.page.locator(doubleClickMessage);
    await expect(actualDoubleClickMessage).toHaveText(
      "You have done a double click"
    );
    console.log("2");
  }

  async rightClcikButton() {
    await this.page.locator(rightClickBtn).click({ button: "right" });
    const actualRightClickMessage = this.page.locator(rightClickMessage);
    await expect(actualRightClickMessage).toHaveText(
      "You have done a right click"
    );
    console.log("3");
    await this.waitForNumberOfSeconds(2);
  }

  async dynamicClickButton() {
    await this.page.locator(dynamicClickBtn).click();
    const actualDynamicMessage = this.page.locator(dynamicClickMessage);
    await expect(actualDynamicMessage).toHaveText(
      "You have done a dynamic click"
    );
    console.log(4);
    await this.waitForNumberOfSeconds(5);
  }
}
