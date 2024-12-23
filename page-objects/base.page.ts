import { Locator, Page } from "@playwright/test";

export class BasePage {
    page: Page;
    searchInput: Locator;
    searchResultsDropdownItem: any;
    constructor(page:Page){
        this.page=page;
        this.searchInput = page.getByRole("search").getByRole("searchbox");
        this.searchResultsDropdownItem = (title: string) => page.getByRole("listbox").locator(`[title='${title}']`)
    }

    async searchForAndSelectMatching(searchValue: string){
        await this.searchInput.pressSequentially(searchValue);
        await this.searchResultsDropdownItem(searchValue).click();
    }
}