import { test } from "@playwright/test";
import { PageManager } from "../pages/PageManager";

test.describe.configure({ mode: "serial" });
const fs = require("fs");
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

test.beforeEach(async ({ page }) => {
  test.setTimeout(90000);
  await page.goto(testData.demoQA_url);
});

test("Land in to the QA test page and practice radio button excercise", async ({
  page,
}) => {
  const pm = new PageManager(page);

  await pm.onTextBoxPage().clickOnElementsLink();

  await pm.onRadioButtonPage().clickOnRadiaoButtonPage();
  await pm.onRadioButtonPage().clickOnDifferentRadioButtons();
});
