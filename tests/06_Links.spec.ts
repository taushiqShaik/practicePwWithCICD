import test from "@playwright/test";
import { PageManager } from "../pages/PageManager";

test.describe.configure({ mode: "serial" });
const fs = require("fs");
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

test.beforeEach(async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(testData.demoQA_url);
});

test("Links page - practice link exercise", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.onTextBoxPage().clickOnElementsLink();
  await pm.onLinksPage().clickOnLinksPage();
  await pm.onLinksPage().verifyLinksHeader();
  await pm.onLinksPage().clickOnStaticLinks();
  await pm.onLinksPage().clickOnDynamicLinks();
  await pm.onLinksPage().linksResponseValidation();
});
