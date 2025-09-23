import {test} from '@playwright/test'

import { PageManager } from '../pages/pageManager'


test.describe.configure({mode: 'serial'})
const fs = require("fs")
const testData = JSON.parse(fs.readFileSync(`./utils/data.json`, `utf-8`));

test.beforeEach(async ({page}) => {
    test.setTimeout(90000);
    await page.goto(testData.demoQA_url)
  
})

test('Login to the QA test page and practice text box ecercise', async ({page}) => {

    const pm = new PageManager(page)
    
    await pm.onTextBoxPage().clickOnElementsLink()
    await pm.onTextBoxPage().clickOnTextBoxPage(
        testData.fullName, 
        testData.cAddress, 
        testData.pAddress
        )
    
});
