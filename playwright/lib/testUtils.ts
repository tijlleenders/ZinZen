import { Browser, Page, expect } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser, storageState: string) {
  const context = await browser.newContext({
    storageState,
  });
  const page = await context.newPage();
  return { context, page };
}

export async function goalActionFlow(page: Page, action: string) {
  await page.locator(".goal-dd-outer").first().click();
  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${action}$`) })
    .first()
    .click();
}

export async function goToShareGoalModalFlow(page: Page) {
  await goalActionFlow(page, "Share");
  await page.getByRole("button", { name: "Share privately" }).click();
  await page.getByRole("button", { name: "Choose contact" }).click();
}

export async function waitForResponseConfirmation(
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

export async function addContact(
  page: Page,
  contactName: string,
  expectedApiResponse1: string,
  expectedApiResponse2: string,
  isFirstContact: boolean,
): Promise<string> {
  const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  await goToShareGoalModalFlow(page);

  // Add contact flow
  if (!isFirstContact) {
    await page.getByRole("button", { name: "add contact", exact: true }).click();
  }
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(contactName);
  await page.getByRole("button", { name: "add contact Share invitation" }).click();
  await waitForResponseConfirmation(page, apiServerUrl, expectedApiResponse1);
  await page.goBack();
  await page.getByRole("button", { name: contactName.slice(0, 1), exact: true }).click();
  await waitForResponseConfirmation(page, apiServerUrl, expectedApiResponse2);
  await page.waitForSelector(".ant-notification-notice");
  return page.evaluate("navigator.clipboard.readText()");
}

export async function collaborateFlow(page: Page) {
  await goalActionFlow(page, "Collaborate");
  await page.getByRole("button", { name: "Collaborate on goal" }).click();
}

export async function acceptContactInvitation(page: Page, invitationLink: string, patnerName: string) {
  await page.goto(`${invitationLink}`);
  await page.getByPlaceholder("Contact name").click();
  await page.getByPlaceholder("Contact name").fill(patnerName);
  await page.getByRole("button", { name: "Add to my contacts" }).click();
}

export async function goToMyGoalsPageFlow(page: Page) {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole("button", { name: "Goals" }).click();
}

export async function verifyUpdatedGoal(page: Page, expectedGoalTitle: string, apiUrlGoal: string): Promise<void> {
  await page.goto("http://127.0.0.1:3000/");
  await Promise.all([page.waitForResponse((res) => res.status() === 200 && res.url().includes(apiUrlGoal))]);

  await page.getByRole("button", { name: "Goals" }).click();
  await page.locator(".goal-dd-outer").first().click();
  await expect(page.getByText(expectedGoalTitle).first()).toBeVisible();
  await page.getByRole("button", { name: "add changes Make all checked" }).click();
  await expect(page.getByText(expectedGoalTitle).first()).toBeVisible();
}
