import { Page } from "playwright";
import { HelperBase } from "../fixtures/helperBase";
import { expect } from "playwright/test";

const {
  webTable,
  webTableHeader,
  addButton,
  firstNameInput,
  lastNameInput,
  emailInput,
  ageInput,
  salaryInput,
  departmentInput,
  submitButton,
} = require("../locators/webTables.locators");

export class WebTablesPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async clickOnWebTables() {
    await this.page.locator(webTable).click();

    const actualWebTableHeader = this.page.locator(webTableHeader);
    await actualWebTableHeader.click();
    await expect(actualWebTableHeader).toHaveText("Web Tables");

    // Get the actual text from the element
    const headerText = await actualWebTableHeader.textContent();
    console.log("Web Tables Header is visible : " + headerText);
  }

  async addNewRecordToTheWebTable(
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    salary: number,
    department: string
  ) {
    await this.page.locator(addButton).click();
    await this.page.locator(firstNameInput).fill(firstName);
    await this.page.locator(lastNameInput).fill(lastName);
    await this.page.locator(emailInput).fill(email);
    await this.page.locator(ageInput).fill(age.toString());
    await this.page.locator(salaryInput).fill(salary.toString());
    await this.page.locator(departmentInput).fill(department);
    await this.page.locator(submitButton).click();

    await this.waitForNumberOfSeconds(10);
  }
}
