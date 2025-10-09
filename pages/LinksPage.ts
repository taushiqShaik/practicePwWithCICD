import { Page } from "playwright";
import { HelperBase } from "../fixtures/helperBase";
import { expect } from "playwright/test";

const { copyright } = require("../locators/home.locators.ts");

const {
  links,
  linksHeader,
  homeSimpleLink,
  homeDynamicLink,
  createdLink,
  noContentLink,
  movedLink,
  badRequestLink,
  unauthorizedLink,
  forbiddenLink,
  notFoundLink,
  //   createdMessage,
  linkResponse,
} = require("../locators/links.locators.ts");

export class LinksPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async clickOnLinksPage() {
    await this.page.locator(links).click();
  }

  async verifyLinksHeader() {
    await this.page.locator(linksHeader).click();
    const actualLinksHeader = this.page.locator(linksHeader);
    await expect(actualLinksHeader).toHaveText("Links");
    console.log(await actualLinksHeader.textContent());
    await this.waitForNumberOfSeconds(5);
  }

  async clickOnStaticLinks() {
    await this.page.locator(homeSimpleLink).click();

    // await this.page.locator(copyright).click();
    const actualCopyrightText = this.page.locator(copyright);
    await expect(actualCopyrightText).toHaveText(
      "© 2013-2020 TOOLSQA.COM | ALL RIGHTS RESERVED."
    );
    console.log(await actualCopyrightText.textContent());
    await this.waitForNumberOfSeconds(5);
  }

  async clickOnDynamicLinks() {
    await this.page.locator(homeDynamicLink).click();

    const actualCopyrightText = this.page.locator(copyright);
    await expect(actualCopyrightText).toHaveText(
      "© 2013-2020 TOOLSQA.COM | ALL RIGHTS RESERVED."
    );
    console.log(await actualCopyrightText.textContent());
    await this.waitForNumberOfSeconds(5);
  }

  async linksResponseValidation() {
    const apiLinks = [
      {
        id: "created",
        result: "Link has responded with staus 201 and status text Created",
      },
      {
        id: "no-content",
        result: "Link has responded with staus 204 and status text No Content",
      },
      {
        id: "moved",
        result:
          "Link has responded with staus 301 and status text Moved Permanently",
      },
      {
        id: "bad-request",
        result: "Link has responded with staus 400 and status text Bad Request",
      },
      {
        id: "unauthorized",
        result:
          "Link has responded with staus 401 and status text Unauthorized",
      },
      {
        id: "forbidden",
        result: "Link has responded with staus 403 and status text Forbidden",
      },
      {
        id: "invalid-url",
        result: "Link has responded with staus 404 and status text Not Found",
      },
    ];

    for (const link of apiLinks) {
      await this.page.locator(`#${link.id}`).click();
      const result = this.page.locator(linkResponse);
      await expect(result).toHaveText(link.result);
      console.log(await result.textContent());
    }
    await this.waitForNumberOfSeconds(5);
  }
}
