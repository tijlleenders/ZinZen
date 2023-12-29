import { Browser, Page } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser, storageState: string) {
  const context = await browser.newContext({
    storageState,
  });
  const page = await context.newPage();
  return { context, page };
}

export async function shareGoalPrivately(userOnePage: Page) {
  await userOnePage.locator(".goal-dd-inner").first().click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^Share$/ })
    .first()
    .click();
}

export async function waitForSpecificResponse(
  page: Page,
  urlContains: string,
  responseBodyIncludes: string,
): Promise<void> {
  await page.waitForResponse(
    async (response) =>
      response.status() === 200 &&
      response.url().includes(urlContains) &&
      (await response.text()).includes(responseBodyIncludes),
  );
}
