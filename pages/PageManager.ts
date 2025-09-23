import { Page } from "playwright";
import { LoginPage } from "./LoginPage";
import { TextBoxPage } from "./TextBoxPage";

export class PageManager{
    private readonly page: Page;
    private readonly loginPage: LoginPage;
    private readonly textBoxPage: TextBoxPage;



constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.textBoxPage = new TextBoxPage(this.page)
}


  onTextBoxPage(){
    return this.textBoxPage
}

  onLoginPage() {
    return this.loginPage;
  }
}