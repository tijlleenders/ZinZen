import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL_GOAL_SHARING } from "../../config/constants";
import {
  acceptContactInvitation,
  addContact,
  createGoalFromGoalPage,
  createUserContextAndPage,
  goToAppPage,
  waitForResponseConfirmation,
} from "../../utils/collaboration-feature-utils";
import { shareGoalFlow } from "../../utils/move-feature-utils";

test.describe.configure({ timeout: 100000 });

// Helper function to retry assertion with page refresh if it times out
async function expectWithRetry(
  page: Page,
  assertion: () => Promise<void>,
  maxRetries: number = 3,
  retryDelay: number = 2000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await assertion();
      return; // Success, exit the function
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Re-throw the error on final attempt
      }

      console.warn(`Assertion failed on attempt ${attempt}. Refreshing page and retrying in ${retryDelay}ms...`);
      await page.reload();
      await page.waitForTimeout(retryDelay);
    }
  }
}

test.describe("Goal Sharing Feature", () => {
  let userAPage: Page;
  let userBPage: Page;
  let userCPage: Page;
  let invitationLink: string;
  const currentGoalTitle = "Test Goal";
  const subgoalTitle = "Subgoal";
  const secondGoalTitle = "Second Shared Goal";
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(100000);
    console.log("Setting up users A, B, and C pages...");
    ({ page: userAPage } = await createUserContextAndPage(browser));
    ({ page: userBPage } = await createUserContextAndPage(browser));
    ({ page: userCPage } = await createUserContextAndPage(browser));
    console.log("Navigating User A to the main page...");
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByText("English").click();
    await userAPage.getByRole("button", { name: "Continue zinzen faq" }).click();

    console.log("Navigating User B to the main page...");
    await userBPage.goto("http://127.0.0.1:3000/");
    await userBPage.getByText("English").click();
    await userBPage.getByRole("button", { name: "Continue zinzen faq" }).click();

    console.log("Navigating User C to the main page...");
    await userCPage.goto("http://127.0.0.1:3000/");
    await userCPage.getByText("English").click();
    await userCPage.getByRole("button", { name: "Continue zinzen faq" }).click();

    console.log(`User A is navigating to their goals page...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is creating a new goal titled "${currentGoalTitle}"...`);
    await createGoalFromGoalPage(userAPage, currentGoalTitle);

    console.log(`User A is adding User B as a contact...`);
    invitationLink = await addContact(userAPage, "B", currentGoalTitle);
    await acceptContactInvitation(userBPage, invitationLink, "B");
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);

    console.log(`User A is sharing the goal with User B...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userAPage, currentGoalTitle, "B");

    console.log(`User B is reloading the page to check for shared goal visibility...`);
    await userBPage.goto("http://127.0.0.1:3000/");
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.waitForTimeout(1000);
    await userBPage.reload();
    await userBPage.getByTestId(`contact-B`).locator("div").first().click();
    await expectWithRetry(userBPage, async () => {
      await expect(userBPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();
    });

    await userBPage.getByTestId(`goal-${currentGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
    await userBPage.getByTestId("zmodal").getByText("Collaborate").click();
    await userBPage.getByRole("button", { name: "Collaborate on goal" }).click();

    await userBPage.getByRole("button", { name: "Goals" }).click();
    invitationLink = await addContact(userBPage, "C", currentGoalTitle);
    await acceptContactInvitation(userCPage, invitationLink, "C");
    await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

    await goToAppPage(userBPage, "Goals", true);

    console.log(`User B is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userBPage, currentGoalTitle, "C");

    await userCPage.goto("http://127.0.0.1:3000/");
    await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);
    await userCPage.getByRole("img", { name: "ZinZen" }).click();
    await userCPage.waitForTimeout(1000);
    await userCPage.reload();
    await userCPage.getByTestId(`contact-C`).locator("div").first().click();
    await expectWithRetry(userCPage, async () => {
      await expect(userCPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();
    });

    await userCPage.getByTestId(`goal-${currentGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
    await userCPage.getByTestId("zmodal").getByText("Collaborate").click();
    await userCPage.getByRole("button", { name: "Collaborate on goal" }).click();
    await userCPage.getByRole("button", { name: "Goals" }).click();
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
    test("check if move ", async () => {
      console.log(`User ${sharer} is moving a subgoal into the shared goal...`);
      await userAPage.goto("http://127.0.0.1:3000/goals");

      // create a subgoal and share it from user A to user B then collaborate and then share to user C
      await createGoalFromGoalPage(userAPage, subgoalTitle);
      await shareGoalFlow(userAPage, subgoalTitle, "B");

      await userBPage.goto("http://127.0.0.1:3000/");
      await userBPage.getByRole("img", { name: "ZinZen" }).click();
      await userBPage.getByTestId(`contact-${receiver}`).locator("div").first().click();

      await userBPage.getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userBPage.getByTestId("zmodal").getByText("Collaborate").click();
      await userBPage.getByRole("button", { name: "Collaborate on goal" }).click();
      await userBPage.getByRole("button", { name: "Goals" }).click();

      await shareGoalFlow(userBPage, subgoalTitle, "C");

      await userCPage.goto("http://127.0.0.1:3000");
      await userCPage.getByRole("img", { name: "ZinZen" }).click();
      await userCPage.getByTestId(`contact-${"C"}`).locator("div").first().click();

      await userCPage.getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userCPage.getByTestId("zmodal").getByText("Collaborate").click();
      await userCPage.getByRole("button", { name: "Collaborate on goal" }).click();
      await userCPage.getByRole("button", { name: "Goals" }).click();

      await userAPage.getByRole("button", { name: "Goals" }).click();
      await userAPage.getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userAPage.getByTestId("zmodal").getByText("Move").click();
      await userAPage.getByRole("button", { name: "Move goal" }).click();

      await userAPage.getByRole("button", { name: "Goals" }).click();
      await userAPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await userAPage.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await userAPage.getByRole("button", { name: "Move here add goal", exact: true }).click();

      await userBPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);
      await userBPage.reload();
      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`notification-dot-${subgoalTitle}`)).toBeVisible();
      });
      // then click on the goal icon
      await userBPage.getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userBPage.getByRole("button", { name: "add changes  Make all checked" }).click();

      await userBPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();
      await expectWithRetry(userBPage, async () => {
        await expect(userBPage.getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });

      await userCPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`notification-dot-${subgoalTitle}`)).toBeVisible();
      });
      await userCPage.getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userCPage.getByRole("button", { name: "add changes  Make all checked" }).click();

      await userCPage
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();
      await expectWithRetry(userCPage, async () => {
        await expect(userCPage.getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });
    });
  });
});
