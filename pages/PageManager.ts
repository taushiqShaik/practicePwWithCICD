import { Page } from "playwright";
import { LoginPage } from "./LoginPage";
import { TextBoxPage } from "./TextBoxPage";
import { CheckBoxPage } from "./CheckBoxPage";
import { RadioButtonPage } from "./RadioButtonPage";
import { WebTablesPage } from "./WebTablesPage";
import { ButtonsPage } from "./ButtonsPage";

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly textBoxPage: TextBoxPage;
  private readonly checkBoxPage: CheckBoxPage;
  private readonly radioButtonPage: RadioButtonPage;
  private readonly webTablesPage: WebTablesPage;
  private readonly buttonsPage: ButtonsPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.textBoxPage = new TextBoxPage(this.page);
    this.checkBoxPage = new CheckBoxPage(this.page);
    this.radioButtonPage = new RadioButtonPage(this.page);
    this.webTablesPage = new WebTablesPage(this.page);
    this.buttonsPage = new ButtonsPage(this.page);
  }

  onButtonsPage() {
    return this.buttonsPage;
  }

  onWebTablesPage() {
    return this.webTablesPage;
  }

  onRadioButtonPage() {
    return this.radioButtonPage;
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
