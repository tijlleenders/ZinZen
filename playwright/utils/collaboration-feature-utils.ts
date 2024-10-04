import { Browser, Page, expect } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  return { context, page };
}

export async function goalActionFlow(page: Page, action: string) {
  await page.locator(".goal-dd-outer").first().click();
  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${action}$`) })
    .first()
    .click({ force: true });
}

export async function goToShareGoalModalFlow(page: Page) {
  await goalActionFlow(page, "Share");
}

export async function waitForResponseConfirmation(
  page: Page,
  urlContains: string,
  responseBodyIncludes: string,
  maxRetries: number = 3,
  retryDelay: number = 15000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await page.waitForResponse(
        async (response) => {
          const status = response.status();
          const url = response.url();
          const text = await response.text();
          const isMatch = status === 200 && url.includes(urlContains) && text.includes(responseBodyIncludes);

          console.log(`Attempt ${attempt} - Response details:
            Status: ${status}
            URL: ${url}
            Includes expected body: ${text.includes(responseBodyIncludes)}
            Is match: ${isMatch}`);

          return isMatch;
        },
        { timeout: 10000 },
      );

      console.log(`Success on attempt ${attempt}`);
      console.log(`Response: ${JSON.stringify(response)}`);
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`All ${maxRetries} attempts failed. Last error: ${error.message}`);
        throw new Error(`Failed to get response confirmation after ${maxRetries} attempts: ${error.message}`);
      }
      console.warn(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      await page.waitForTimeout(retryDelay);
    }
  }
}
export async function addContact(
  page: Page,
  contactName: string,
  expectedApiResponse1: string,
  expectedApiResponse2: string,
): Promise<string> {
  const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  await goToShareGoalModalFlow(page);

  // Add contact flow
  await page.getByRole("button", { name: "add contact", exact: true }).click();
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
      await page.locator(".goal-dd-outer").first().click();

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
