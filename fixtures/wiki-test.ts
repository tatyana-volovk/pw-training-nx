import { test as base } from '@playwright/test';
import { MainPage } from '../page-objects/main.page';
import { ArticlePage } from '../page-objects/article.page';
import 'dotenv/config';

// Declare the types of your fixtures.
type MyFixtures = {
  mainPage: MainPage;
  articlePage: ArticlePage;
};

// Extend base test by providing "mainPage" and "articlePage".
export const test = base.extend<MyFixtures>({
  page: async ({ page, baseURL }, use) => {
    await page.goto('/');
    await use(page);
  },
  mainPage: async ({ page }, use) => {
    // Use the fixture value in the test.
    await use(new MainPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

});
export { expect, Page } from '@playwright/test';