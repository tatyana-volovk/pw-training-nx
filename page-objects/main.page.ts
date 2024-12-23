import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class MainPage extends BasePage {
    welcomeHeader: Locator;

    constructor(page: Page){
        super(page);
        this.welcomeHeader = page.locator('#mw-content-text h1');
    }
}
