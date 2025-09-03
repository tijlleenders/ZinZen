import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL_GOAL_SHARING, API_SERVER_URL_RELATIONSHIPS } from "../../config/constants";
import {
  acceptContactInvitation,
  addContact,
  createGoalFromGoalPage,
  createUserContextAndPage,
  goToAppPage,
  goToShareGoalModalFlow,
  waitForResponseConfirmation,
} from "../../utils/collaboration-feature-utils";
import { shareGoalFlow } from "../../utils/move-feature-utils";

test.describe.configure({ timeout: 100000 });

// Enhanced helper function to retry assertion with multiple recovery strategies for CI/CD environments
async function expectWithRetry(
  page: Page,
  assertion: () => Promise<void>,
  maxRetries: number = 5, // Increased retries for CI/CD
  retryDelay: number = 3000, // Increased delay for CI/CD
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await assertion();
      return; // Success, exit the function
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Assertion failed after ${maxRetries} attempts. Final error: ${error.message}`);
        throw error; // Re-throw the error on final attempt
      }

      console.warn(`Assertion failed on attempt ${attempt}/${maxRetries}. Error: ${error.message}`);

      // Progressive recovery strategies for CI/CD environments
      if (attempt === 1) {
        // First retry: Just wait a bit longer
        console.log(`First retry: Waiting ${retryDelay}ms before retry...`);
        await page.waitForTimeout(retryDelay);
      } else if (attempt === 2) {
        // Second retry: Wait and try to stabilize the page
        console.log(`Second retry: Waiting ${retryDelay}ms and stabilizing page...`);
        await page.waitForTimeout(retryDelay);
        // Wait for page to be ready
        await page.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch(() => {});
      } else if (attempt === 3) {
        // Third retry: Refresh the page
        console.log(`Third retry: Refreshing page and waiting ${retryDelay}ms...`);
        await page.reload({ timeout: 30000 });
        await page.waitForLoadState("domcontentloaded", { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(retryDelay);
      } else {
        // Fourth retry: Hard refresh and longer wait
        console.log(`Fourth retry: Hard refresh and waiting ${retryDelay * 2}ms...`);
        await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForLoadState("domcontentloaded", { timeout: 25000 }).catch(() => {});
        await page.waitForTimeout(retryDelay * 2);
      }
    }
  }
}

test.describe("Goal Sharing Feature", () => {
  let userAPage: Page;
  let userBPage: Page;
  let userCPage: Page;
  let invitationLink: string;
  const currentGoalTitle = "Test Goal";
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(100000);
    console.log("Setting up users A, B, and C pages...");
    ({ page: userAPage } = await createUserContextAndPage(browser));
    ({ page: userBPage } = await createUserContextAndPage(browser));
    ({ page: userCPage } = await createUserContextAndPage(browser));
    console.log("Navigating User A to the main page...");
    await userAPage.goto("http://127.0.0.1:3000/", { timeout: 30000 });
    await userAPage.getByText("English").click({ timeout: 10000 });
    await userAPage.getByRole("button", { name: "Continue zinzen faq" }).click({ timeout: 10000 });

    console.log("Navigating User B to the main page...");
    await userBPage.goto("http://127.0.0.1:3000/", { timeout: 30000 });
    await userBPage.getByText("English").click({ timeout: 10000 });
    await userBPage.getByRole("button", { name: "Continue zinzen faq" }).click({ timeout: 10000 });

    console.log("Navigating User C to the main page...");
    await userCPage.goto("http://127.0.0.1:3000/", { timeout: 30000 });
    await userCPage.getByText("English").click({ timeout: 10000 });
    await userCPage.getByRole("button", { name: "Continue zinzen faq" }).click({ timeout: 10000 });

    console.log(`User A is navigating to their goals page...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is creating a new goal titled "${currentGoalTitle}"...`);
    await createGoalFromGoalPage(userAPage, currentGoalTitle);

    console.log(`User A is adding User B as a contact...`);
    invitationLink = await addContact(userAPage, "B", currentGoalTitle);
    await acceptContactInvitation(userBPage, invitationLink, "B");
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_RELATIONSHIPS);

    console.log(`User A is sharing the goal with User B...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userAPage, currentGoalTitle, "B");

    console.log(`User B is reloading the page to check for shared goal visibility...`);
    await userBPage.goto("http://127.0.0.1:3000/", { timeout: 30000 });
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);
    await userBPage.getByRole("img", { name: "ZinZen" }).click({ timeout: 10000 });
    await userBPage.waitForTimeout(2000);
    await userBPage.reload({ timeout: 30000 });
    await userBPage.getByTestId(`contact-B`).locator("div").first().click({ timeout: 10000 });
    await expectWithRetry(userBPage, async () => {
      await expect(userBPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible({ timeout: 15000 });
    });

    await userBPage
      .getByTestId(`goal-${currentGoalTitle}`)
      .getByTestId("goal-icon")
      .locator("div")
      .first()
      .click({ timeout: 10000 });
    await userBPage.getByTestId("zmodal").getByText("Collaborate").click({ timeout: 10000 });
    await userBPage.getByRole("button", { name: "Collaborate on goal" }).click({ timeout: 10000 });

    await userBPage.getByRole("button", { name: "Goals" }).click({ timeout: 10000 });
    invitationLink = await addContact(userBPage, "C", currentGoalTitle);
    await acceptContactInvitation(userCPage, invitationLink, "C");
    await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

    await goToAppPage(userBPage, "Goals", true);

    console.log(`User B is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userBPage, currentGoalTitle, "C");

    await userCPage.goto("http://127.0.0.1:3000/", { timeout: 30000 });
    await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);
    await userCPage.getByRole("img", { name: "ZinZen" }).click({ timeout: 10000 });
    await userCPage.waitForTimeout(2000);
    await userCPage.reload({ timeout: 30000 });
    await userCPage.getByTestId(`contact-C`).locator("div").first().click({ timeout: 10000 });
    await expectWithRetry(userCPage, async () => {
      await expect(userCPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible({ timeout: 15000 });
    });

    await userCPage
      .getByTestId(`goal-${currentGoalTitle}`)
      .getByTestId("goal-icon")
      .locator("div")
      .first()
      .click({ timeout: 10000 });
    await userCPage.getByTestId("zmodal").getByText("Collaborate").click({ timeout: 10000 });
    await userCPage.getByRole("button", { name: "Collaborate on goal" }).click({ timeout: 10000 });
    await userCPage.getByRole("button", { name: "Goals" }).click({ timeout: 10000 });
  });

  test.afterAll(async () => {
    console.log("Closing all user pages...");
    await userAPage.close();
    await userBPage.close();
    await userCPage.close();
  });

  const userCollaborationScenarios = [
    { sharer: "A", receiver: "B", sharerPage: () => userAPage, receiverPage: () => userBPage },
  ];

  userCollaborationScenarios.forEach(({ sharer, receiver, sharerPage, receiverPage }) => {
    test("check if collaboration works between users correctly", async () => {
      await userAPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });

      await userAPage.getByRole("button", { name: "Goals" }).click({ timeout: 10000 });
      await userAPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userAPage.getByTestId("zmodal").getByText("Edit").click({ timeout: 10000 });
      await userAPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by A`);
      await userAPage.locator(".ant-modal-wrap").click({ timeout: 10000 });

      await userAPage.waitForResponse(
        async (res) => {
          if (res.url().includes(API_SERVER_URL_GOAL_SHARING) && res.status() === 200) {
            try {
              const responseBody = await res.json();
              return responseBody.message === "OK";
            } catch (error) {
              return false;
            }
          }
          return false;
        },
        { timeout: 30000 },
      );

      await userBPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible({ timeout: 15000 });
      });
      await userBPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userBPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });

      await userBPage.waitForResponse(
        async (res) => {
          if (res.url().includes(API_SERVER_URL_GOAL_SHARING) && res.status() === 200) {
            try {
              const responseBody = await res.json();
              return responseBody.message === "OK";
            } catch (error) {
              return false;
            }
          }
          return false;
        },
        { timeout: 30000 },
      );

      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`goal-${currentGoalTitle} edited by A`)).toBeVisible({ timeout: 15000 });
      });

      await userCPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible({ timeout: 15000 });
      });
      await userCPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userCPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });
      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`goal-${currentGoalTitle} edited by A`)).toBeVisible({ timeout: 15000 });
      });

      await userBPage.getByRole("button", { name: "Goals" }).click({ timeout: 10000 });
      await userBPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userBPage.getByTestId("zmodal").getByText("Edit").first().click({ timeout: 10000 });
      await userBPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by B`);
      await userBPage.locator(".ant-modal-wrap").click({ timeout: 10000 });

      await userBPage.waitForResponse(
        async (res) => {
          if (res.url().includes(API_SERVER_URL_GOAL_SHARING) && res.status() === 200) {
            return true;
          }
          return false;
        },
        { timeout: 30000 },
      );

      await userCPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`notification-dot-${currentGoalTitle} edited by A`)).toBeVisible({
          timeout: 15000,
        });
      });
      await userCPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userCPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });
      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`goal-${currentGoalTitle} edited by B`)).toBeVisible({ timeout: 15000 });
      });

      await userAPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userAPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userAPage, async () => {
        await expect(userAPage.getByTestId(`notification-dot-${currentGoalTitle} edited by A`)).toBeVisible({
          timeout: 15000,
        });
      });
      await userAPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userAPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });

      await expectWithRetry(userAPage, async () => {
        await expect(userAPage.getByTestId(`goal-${currentGoalTitle} edited by B`)).toBeVisible({ timeout: 15000 });
      });

      await userCPage.getByRole("button", { name: "Goals" }).click({ timeout: 10000 });
      await userCPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userCPage.getByTestId("zmodal").getByText("Edit").first().click({ timeout: 10000 });
      await userCPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by C`);
      await userCPage.locator(".ant-modal-wrap").click({ timeout: 10000 });

      await userBPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`notification-dot-${currentGoalTitle} edited by B`)).toBeVisible({
          timeout: 15000,
        });
      });
      await userBPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userBPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });
      await userBPage.waitForResponse(
        async (res) => {
          if (res.url().includes(API_SERVER_URL_GOAL_SHARING) && res.status() === 200) {
            try {
              const responseBody = await res.json();
              return responseBody.message === "OK";
            } catch (error) {
              return false;
            }
          }
          return false;
        },
        { timeout: 30000 },
      );
      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`goal-${currentGoalTitle} edited by C`)).toBeVisible({ timeout: 15000 });
      });

      await userAPage.goto("http://127.0.0.1:3000/goals", { timeout: 30000 });
      await waitForResponseConfirmation(userAPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userAPage, async () => {
        await expect(userAPage.getByTestId(`notification-dot-${currentGoalTitle} edited by B`)).toBeVisible({
          timeout: 15000,
        });
      });
      await userAPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click({ timeout: 10000 });
      await userAPage.getByRole("button", { name: "add changes  Make all checked" }).click({ timeout: 10000 });
      await expectWithRetry(userAPage, async () => {
        await expect(userAPage.getByTestId(`goal-${currentGoalTitle} edited by C`)).toBeVisible({ timeout: 15000 });
      });
    });
  });
});
