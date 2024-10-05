import { Browser, Page, expect } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser) {
  console.log("Creating a new user context and page...");
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("User context and page created successfully.");
  return { context, page };
}

export async function goalActionFlow(page: Page, action: string, goalTitle: string) {
  console.log(`Executing action "${action}" on goal titled "${goalTitle}"...`);
  const goalDiv = await page.locator(".user-goal-main").filter({ hasText: new RegExp(`^${goalTitle}$`) });
  console.log("Located goal div:", goalDiv);

  const goalDropdown = await page
    .locator(".user-goal-main")
    .filter({
      has: page.locator('.goal-title:has-text("Test Goal")'),
    })
    .locator(".goal-dd-outer");

  console.log("Clicking on the goal dropdown...");
  await goalDropdown.click();

  console.log(`Clicking on the action "${action}"...`);
  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${action}$`) })
    .first()
    .click({ force: true });
}

export async function goToShareGoalModalFlow(page: Page, goalTitle: string) {
  console.log(`Navigating to Share Goal modal for goal titled "${goalTitle}"...`);
  await goalActionFlow(page, "Share", goalTitle);
}

export async function waitForResponseConfirmation(
  page: Page,
  urlContains: string,
  maxRetries: number = 3,
  retryDelay: number = 2000,
): Promise<void> {
  console.log(`Waiting for response confirmation for URL containing "${urlContains}"...`);
  let response;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}...`);
    try {
      if (attempt > 1) {
        console.log("Reloading the page...");
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
  console.log(`Adding contact "${contactName}" to goal "${goalTitle}"...`);
  const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  await goToShareGoalModalFlow(page, goalTitle);

  console.log("Opening 'Add contact' modal...");
  await page.getByRole("button", { name: "add contact", exact: true }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(contactName);
  await page.getByRole("button", { name: "add contact Share invitation" }).click();

  console.log("Waiting for response confirmation after adding contact...");
  await waitForResponseConfirmation(page, apiServerUrl);

  console.log("Navigating back and clicking on the contact...");
  await page.goBack();
  await page.getByRole("button", { name: contactName.slice(0, 1), exact: true }).click();

  console.log("Waiting for confirmation of contact invitation...");
  await waitForResponseConfirmation(page, apiServerUrl);
  await page.waitForSelector(".ant-notification-notice");

  console.log("Reading invitation link from clipboard...");
  return page.evaluate("navigator.clipboard.readText()");
}

export async function collaborateFlow(page: Page, goalTitle: string) {
  console.log(`Initiating collaboration on goal titled "${goalTitle}"...`);
  await expect(async () => {
    await goalActionFlow(page, "Collaborate", goalTitle);
    await expect(page.getByRole("button", { name: "Collaborate on goal" })).toBeVisible();

    console.log("Clicking 'Collaborate on goal'...");
    await page.getByRole("button", { name: "Collaborate on goal" }).click();
  }).toPass();
}

export async function acceptContactInvitation(page: Page, invitationLink: string, partnerName: string) {
  console.log(`Accepting contact invitation using link: ${invitationLink}`);
  await page.goto(`${invitationLink}`);

  console.log(`Filling in partner name "${partnerName}"...`);
  await page.getByPlaceholder("Contact name").click();
  await page.getByPlaceholder("Contact name").fill(partnerName);
  await page.getByRole("button", { name: "Add to my contacts" }).click();
}

export async function goToMyGoalsPageFlow(page: Page) {
  console.log("Navigating to 'My Goals' page...");
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
  console.log(`Verifying updated goal titled "${expectedGoalTitle}"...`);
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}...`);
    try {
      await page.goto("http://127.0.0.1:3000/");
      await Promise.all([
        page.waitForResponse((res) => res.status() === 200 && res.url().includes(apiUrlGoal), { timeout: 10000 }),
      ]);
      await page.getByRole("button", { name: "Goals" }).click();

      const goalDropdownWithContact = page
        .locator(".user-goal-dark")
        .filter({
          has: page.locator(".contact-icon"),
        })
        .locator(".goal-dd-outer");

      console.log("Checking for notification dot...");
      await expect(goalDropdownWithContact.getByTestId("notification-dot")).toBeVisible();
      await goalDropdownWithContact.click();

      console.log(`Waiting for goal titled "${expectedGoalTitle}" to be visible...`);
      await page.waitForSelector(`text=${expectedGoalTitle}`, { timeout: 10000 });

      console.log("Applying changes...");
      await page.getByRole("button", { name: "add changes Make all checked" }).click();

      console.log(`Verifying if the goal "${expectedGoalTitle}" is updated successfully...`);
      await page.waitForSelector(`text=${expectedGoalTitle}`, { timeout: 10000 });

      return;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Failed to verify updated goal after ${maxRetries} attempts: ${error.message}`);
        throw new Error(`Failed to verify updated goal: ${error.message}`);
      }
      console.warn(`Attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      await page.waitForTimeout(retryDelay);
    }
  }
}

export async function waitForPageLoad(page: Page, retries: number = 3, retryDelay: number = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempting to wait for networkidle state (Attempt ${attempt})...`);
      await page.waitForLoadState("networkidle", { timeout: 5000 });
      console.log("Page load state reached networkidle successfully.");
      return; // Success, exit the function
    } catch (error) {
      console.warn(`Page load attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      if (attempt === retries) {
        console.error(`Failed after ${retries} attempts: ${error.message}`);
        throw new Error(`Failed to wait for page load state: ${error.message}`);
      }
      await page.waitForTimeout(retryDelay); // Wait before retrying
    }
  }
}
