import { Page } from "playwright";
import { LoginPage } from "./LoginPage";
import { TextBoxPage } from "./TextBoxPage";
import { CheckBoxPage } from "./CheckBoxPage";

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly textBoxPage: TextBoxPage;
  private readonly checkBoxPage: CheckBoxPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.textBoxPage = new TextBoxPage(this.page);
    this.checkBoxPage = new CheckBoxPage(this.page);
  }

  onCheckBoxPage() {
    return this.checkBoxPage;
  }

  onTextBoxPage() {
    return this.textBoxPage;
  }

  onLoginPage() {
    return this.loginPage;
  }
}
