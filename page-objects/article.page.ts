import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ArticlePage extends BasePage {
    articleTitle: Locator;
    readLink: Locator;
    editLink: Locator;
    viewHistoryLink: Locator;
    editConfirmationModal: Locator;
    startEditingButton: Locator;
    helpLink: Locator;
    languagesButton: Locator;
    languageSearchInput: Locator;
    languagesDropdownItem: (lang: string) => Locator;
    constructor(page: Page) {
        super(page);
        this.articleTitle = page.locator('h1>.mw-page-title-main');
        this.readLink = page.locator('#ca-view>a')
        this.editLink = page.locator('#ca-edit>a');
        this.viewHistoryLink = page.locator('#ca-history>a');
        this.editConfirmationModal = page.locator('.oo-ui-window-content-setup');
        this.startEditingButton = page.getByRole('button', { name: process.env.START_EDIT_BUTTON });
        this.helpLink = page.locator('.mw-helplink');
        this.languagesButton = page.locator('#p-lang-btn');
        this.languageSearchInput = page.locator(".uls-languagefilter");
        this.languagesDropdownItem = (lang) => page.locator('.uls-language-block').locator('visible=true').getByText(lang);
    }

    async changeLanguage(language: string){
        await this.languagesButton.click();
        await this.languageSearchInput.fill(language);
        await this.languagesDropdownItem(language).click();
    }

    async verifySubTabSelected(subTabLink: Locator){
        await expect(subTabLink.locator('..')).toHaveClass(/selected/);
    }
}
