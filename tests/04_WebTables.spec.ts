import test from "playwright/test";
import { PageManager } from "../pages/PageManager";

test.describe.configure({ mode: "serial" });
const fs = require("fs");
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

test.beforeEach(async ({ page }) => {
  test.setTimeout(90000);
  // page.on("request", (req) => console.log(`➡️ ${req.method()} ${req.url()}`));
  // page.on("response", (res) => console.log(`⬅️ ${res.status()} ${res.url()}`));
  await page.goto(testData.demoQA_url);
});

test("Land on to the QA test page and practice web table excercise", async ({
  page,
}) => {
  const pm = new PageManager(page);

  // await pm.onTextBoxPage().captureConsoleLogs();

  await pm.onTextBoxPage().clickOnElementsLink();
  await pm.onWebTablesPage().clickOnWebTables();
  await pm
    .onWebTablesPage()
    .addNewRecordToTheWebTable(
      testData.firstName,
      testData.lastName,
      testData.userEmail,
      testData.age,
      testData.salary,
      testData.department
    );
});
