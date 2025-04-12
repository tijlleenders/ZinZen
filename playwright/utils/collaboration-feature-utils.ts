import { Browser, Page, expect } from "@playwright/test";

export async function createUserContextAndPage(browser: Browser) {
  console.log("Creating a new user context and page...");
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("User context and page created successfully.");
  return { context, page };
}

export async function goalActionFlow(page: Page, action: string, goalTitle: string) {
  await page.getByTestId(`goal-${goalTitle}`).getByTestId("goal-icon").locator("div").first().click();
  await page.getByTestId("zmodal").getByText(action).first().click();
}

export async function goToShareGoalModalFlow(page: Page, goalTitle: string) {
  console.log(`Navigating to Share Goal modal for goal titled "${goalTitle}"...`);
  await goalActionFlow(page, "Share", goalTitle);
}

export async function waitForResponseConfirmation(
  page: Page,
  urlContains: string,
  maxRetries = 3,
  retryDelay = 2000,
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

export type AppPageName = "Goals" | "Feelings" | "Groups";

export async function goToAppPage(page: Page, appPageName: AppPageName, reload = false) {
  console.log("Navigating to 'My Goals' page...");
  if (reload) {
    await page.goto("http://127.0.0.1:3000/");
  }
  await page.getByRole("button", { name: appPageName }).click();
}

export async function createGoalFromGoalPage(page: Page, goalTitle: string) {
  await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
  const titleInputContainer = page.getByPlaceholder("Goal title");
  await titleInputContainer.fill(goalTitle);
  await titleInputContainer.press("Enter");
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
      await expect(goalDropdownWithContact.getByTestId(`notification-dot-${expectedGoalTitle}`)).toBeVisible();
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
