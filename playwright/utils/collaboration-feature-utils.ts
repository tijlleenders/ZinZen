import { Browser, Page, expect } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  return { context, page };
}

export async function goalActionFlow(page: Page, action: string, goalTitle: string) {
  const goalDiv = await page.locator(".user-goal-main").filter({ hasText: new RegExp(`^${goalTitle}$`) });
  console.log(goalDiv);

  const goalDropdown = await page
    .locator(".user-goal-main")
    .filter({
      has: page.locator('.goal-title:has-text("Test Goal")'),
    })
    .locator(".goal-dd-outer");

  await goalDropdown.click();

  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${action}$`) })
    .first()
    .click({ force: true });
}

export async function goToShareGoalModalFlow(page: Page, goalTitle: string) {
  await goalActionFlow(page, "Share", goalTitle);
}

export async function waitForResponseConfirmation(
  page: Page,
  urlContains: string,
  maxRetries: number = 3,
  retryDelay: number = 2000,
): Promise<void> {
  let response;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        page.reload();
      }
      response = await page.waitForResponse((res) => res.url().includes(urlContains) && res.status() === 200, {
        timeout: 5000,
      });

      console.log(`Success on attempt ${attempt}`);
      const responseBody = await response.text();
      console.log(`Response status: ${response.status()}`);
      console.log(`Response body: ${responseBody}`);

      return;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      if (attempt === maxRetries) {
        console.error(`Failed after ${maxRetries} attempts. Last error: ${error.message}`);
        throw new Error(`Failed to get response confirmation: ${error.message}`);
      }

      await page.waitForTimeout(retryDelay);
    }
  }
}

export async function addContact(page: Page, contactName: string, goalTitle: string): Promise<string> {
  const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  await goToShareGoalModalFlow(page, goalTitle);

  // Add contact flow
  await page.getByRole("button", { name: "add contact", exact: true }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(contactName);
  await page.getByRole("button", { name: "add contact Share invitation" }).click();
  await waitForResponseConfirmation(page, apiServerUrl);
  await page.goBack();
  await page.getByRole("button", { name: contactName.slice(0, 1), exact: true }).click();
  await waitForResponseConfirmation(page, apiServerUrl);
  await page.waitForSelector(".ant-notification-notice");
  return page.evaluate("navigator.clipboard.readText()");
}

export async function collaborateFlow(page: Page, goalTitle: string) {
  await goalActionFlow(page, "Collaborate", goalTitle);
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

export async function verifyUpdatedGoal(
  page: Page,
  expectedGoalTitle: string,
  apiUrlGoal: string,
  maxRetries: number = 3,
  retryDelay: number = 2000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto("http://127.0.0.1:3000/");
      await Promise.all([
        page.waitForResponse((res) => res.status() === 200 && res.url().includes(apiUrlGoal), { timeout: 10000 }),
      ]);
      await page.getByRole("button", { name: "Goals" }).click();
      await page.waitForLoadState("networkidle");
      const goalDropdownWithContact = page
        .locator(".user-goal-dark")
        .filter({
          has: page.locator(".contact-icon"),
        })
        .locator(".goal-dd-outer");

      await goalDropdownWithContact.click();

      await page.waitForSelector(`text=${expectedGoalTitle}`, { timeout: 10000 });

      await page.getByRole("button", { name: "add changes Make all checked" }).click();

      await page.waitForSelector(`text=${expectedGoalTitle}`, { timeout: 10000 });

      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`Failed to verify updated goal after ${maxRetries} attempts: ${error.message}`);
      }
      console.warn(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      await page.waitForTimeout(retryDelay);
    }
  }
}
