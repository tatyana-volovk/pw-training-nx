import { Page, TestInfo } from "@playwright/test";

export async function screenshot(testInfo: TestInfo, page: Page, fileName:string) {
    await testInfo.attach(fileName, {
        body: await page.screenshot(),
        contentType: 'image/png'
    });
}