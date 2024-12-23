import { test, expect, Page } from '../fixtures/wiki-test';
import 'dotenv/config';

const title = process.env.TITLE as string;
const welcomeText = process.env.WELCOME_TEXT as string;
const otherLanguage = process.env.OTHER_LANGUAGE as string;
const otherLanguageTitle = process.env.OTHER_LANGUAGE_TITLE as string;
test.describe('Wiki test', async () => {
    test('Verify search, article edit and history, languages', async ({ mainPage, articlePage, page }, testInfo) => {
        await test.step('Verfiy that Main page is opened', async () => {
            await expect(mainPage.welcomeHeader).toContainText(welcomeText);
            await testInfo.attach('MainPage', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
        });

        await test.step(`Search for ${title}`, async () => {
            await mainPage.searchForAndSelectMatching(title);
        })

        await test.step('Verify article title is expected', async () => {
            await expect(articlePage.articleTitle).toHaveText(title);
            await testInfo.attach('ArticlePage', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
        })

        await test.step("Click 'Edit' and verify that modal is shown", async() => {
            await articlePage.editLink.click();
            await articlePage.verifySubTabSelected(articlePage.editLink);
            await expect(articlePage.editConfirmationModal).toBeVisible();
            await testInfo.attach('EditModalShown', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
        })

        await test.step("Click 'Start editing' and verify that modal is hidden", async() => {
            await articlePage.startEditingButton.click();
            await expect(articlePage.editConfirmationModal).toBeHidden();
            await testInfo.attach('EditModalHidden', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
        });

        let newPage: Page;
        await test.step("Click 'View history', click 'Help' and verify that new tab opens with expected url", async() => {
            await articlePage.viewHistoryLink.click();
            await articlePage.verifySubTabSelected(articlePage.viewHistoryLink);

           // Start waiting for new page before clicking. Note no await.
            const pagePromise = page.context().waitForEvent('page');
            await articlePage.helpLink.click();
            newPage = await pagePromise;
            
            await newPage.waitForURL('https://www.mediawiki.org/wiki/Help:History');
            
        });

        await test.step("Go back to 'Read' section of 'Playwright' page. "
            + `Open language list, search and select other language - ${otherLanguage}`, async() => {
                await newPage.close();
                await page.goBack();
                await page.goBack();
                await articlePage.verifySubTabSelected(articlePage.readLink);
                await articlePage.changeLanguage(otherLanguage);
        });
        
        await test.step('Verify that appropriate article opens, take a screenshot', async() => {
            await expect(articlePage.articleTitle).toHaveText(otherLanguageTitle);
            await testInfo.attach('TranslatedArticle', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
        })
    })
}
)