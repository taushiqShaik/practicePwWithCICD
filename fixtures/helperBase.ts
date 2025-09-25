import { BrowserContext, Page } from "playwright";
import { expect } from "playwright/test";
import { PageManager } from "../pages/PageManager";

let page: Page;

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForNumberOfSeconds(timeInSeconds: number) {
    await this.page.waitForTimeout(timeInSeconds * 1000);
  }
}
