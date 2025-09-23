import {expect, Page} from '@playwright/test'
import { HelperBase } from '../fixtures/helperBase'

const {
    elementsLink,
    textBox,
    fullNamePlaceHolder,
    currentAddress,
    permanentAddress,
    submitButton
} = require ("../locators/textBox.locators")

export class TextBoxPage extends HelperBase{
    
    // readonly page: Page

    constructor(page: Page){
        // this.page = page
        super(page)
    }

    async clickOnElementsLink(){
        
        await this.page.locator(elementsLink).click()
       
        
    }

    async clickOnTextBoxPage(fullName : string, cAddress : string, pAddress : string){
        await this.page.locator(textBox).click()
        
        await this.page.getByPlaceholder(fullNamePlaceHolder).fill(fullName)
        await this.page.getByRole('textbox', { name: 'name@example.com' }).fill('test@email.com');
        await this.page.getByPlaceholder(currentAddress).fill(cAddress)
        await this.page.locator(permanentAddress).fill(pAddress)

        // await this.page.getByTestId(submitButton).click()
        await this.page.getByRole('button', {name :submitButton}).click()
        // await this.page.getByRole('')


        await this.waitForNumberOfSeconds(10) 
    }

}
