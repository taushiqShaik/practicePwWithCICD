import { test } from "@playwright/test";

import { PageManager } from "../pages/PageManager";

test.describe.configure({ mode: "serial" });
const fs = require("fs");
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

test.beforeEach(async ({ page }) => {
  test.setTimeout(90000);
  await page.goto(testData.swagLab_url);
});

test.skip("Login to the Web application and then logout", async ({ page }) => {
  const pm = new PageManager(page);

  await pm
    .onLoginPage()
    .loginUsingCredentials(testData.user_name, testData.user_pwd);
});
