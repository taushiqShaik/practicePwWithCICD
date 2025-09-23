import {expect, Page} from '@playwright/test'
import { HelperBase } from '../fixtures/helperBase'

const {
    userNameLocator,
    passwordLocator,
    loginButton
} = require ("../locators/login.locators")

export class LoginPage extends HelperBase{
    
    // readonly page: Page

    constructor(page: Page){
        // this.page = page
        super(page)
    }


    async loginUsingCredentials(userName: string, password: string){
        const userNameField = this.page.locator(userNameLocator)
        userNameField.click()
        userNameField.fill(userName)

        const passwordField = this.page.locator(passwordLocator)
        await passwordField.click()
        await passwordField.fill(password)
        await this.page.locator(loginButton).click()
        
    }
}