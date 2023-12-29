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

export async function addContactAndShareGoal(
  page: Page,
  contactName: string,
  expectedApiResponse1: string,
  expectedApiResponse2: string,
  isFirstContact: boolean,
): Promise<string> {
  const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  await shareGoalPrivately(page);
  if (!isFirstContact) {
    await page.getByRole("button", { name: "add contact", exact: true }).click();
  }
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(contactName);
  await page.getByRole("button", { name: "add contact Share invitation" }).click();
  await waitForSpecificResponse(page, apiServerUrl, expectedApiResponse1);
  await page.goBack();
  await page.getByRole("button", { name: contactName.slice(0, 1), exact: true }).click();
  await waitForSpecificResponse(page, apiServerUrl, expectedApiResponse2);
  await page.waitForSelector(".ant-notification-notice");
  return page.evaluate("navigator.clipboard.readText()");
}
