import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL_GOAL_SHARING, API_SERVER_URL_RELATIONSHIPS } from "../../config/constants";
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
        await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      } else if (attempt === 3) {
        // Third retry: Refresh the page
        console.log(`Third retry: Refreshing page and waiting ${retryDelay}ms...`);
        await page.reload();
        await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(retryDelay);
      } else {
        // Fourth retry: Hard refresh and longer wait
        console.log(`Fourth retry: Hard refresh and waiting ${retryDelay * 2}ms...`);
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(retryDelay * 2);
      }
    }
  }
}

test.describe("Goal Sharing Feature", () => {
  let userAPage: Page;
  let userBPage: Page;
  let invitationLink: string;
  const currentGoalTitle = "Test Goal";
  const subgoalTitle = "Subgoal";
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(100000);
    console.log("Setting up users A, B, and C pages...");
    ({ page: userAPage } = await createUserContextAndPage(browser));
    ({ page: userBPage } = await createUserContextAndPage(browser));

    console.log("Navigating User A to the main page...");
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByText("English").click();
    await userAPage.getByRole("button", { name: "Continue zinzen faq" }).click();

    console.log("Navigating User B to the main page...");
    await userBPage.goto("http://127.0.0.1:3000/");
    await userBPage.getByText("English").click();
    await userBPage.getByRole("button", { name: "Continue zinzen faq" }).click();

    console.log(`User A is navigating to their goals page...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is creating a new goal titled "${currentGoalTitle}"...`);
    await createGoalFromGoalPage(userAPage, currentGoalTitle);

    console.log(`User A is adding User B as a contact...`);
    invitationLink = await addContact(userAPage, "B", currentGoalTitle);
    await acceptContactInvitation(userBPage, invitationLink, "B");
    await userBPage.waitForResponse(async (response) => {
      const url = API_SERVER_URL_RELATIONSHIPS;
      if (response.url().includes(url)) {
        const responseData = await response.json();
        return responseData.status === "accepted";
      }
      return false;
    });

    console.log(`User A is sharing the goal with User B...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userAPage, currentGoalTitle, "B");

    console.log(`User B is reloading the page to check for shared goal visibility...`);
    await userBPage.goto("http://127.0.0.1:3000/");

    await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.reload();

    await userBPage.getByTestId(`contact-B`).locator("div").first().click();
    await expectWithRetry(userBPage, async () => {
      await expect(userBPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();
    });

    await userAPage.goto("http://127.0.0.1:3000/");
  });

  test.afterAll(async () => {
    console.log("Closing all user pages...");
    await userAPage.close();
    await userBPage.close();
  });

  const userCollaborationScenarios = [
    { sharer: "A", receiver: "B", sharerPage: () => userAPage, receiverPage: () => userBPage },
  ];

  userCollaborationScenarios.forEach(({ sharer, receiver, sharerPage, receiverPage }) => {
    test("sharer moves a subgoal into shared goal and check if it is not visible in User receiver MyGoal", async () => {
      console.log(`User ${sharer} is moving a subgoal into the shared goal...`);
      await sharerPage().goto("http://127.0.0.1:3000/goals");
      // create 2 goals
      await createGoalFromGoalPage(sharerPage(), subgoalTitle);

      await sharerPage().waitForTimeout(1000);
      // move the subgoal into the shared goal
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      // check if the subgoal is not visible in User receiver MyGoal
      await receiverPage().goto("http://127.0.0.1:3000");
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();

      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();

      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();

      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeHidden();
      });

      // share the subgoal with receiver
      await sharerPage().getByTestId(`navigation-button-Goals`).click();
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await shareGoalFlow(sharerPage(), subgoalTitle, receiver);

      // check if the subgoal is visible in receiver under the currentGoalTitle
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();

      // Use retry mechanism with refresh for the critical assertion
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });

      // move the subgoal to root goal
      await sharerPage().getByTestId(`navigation-button-Goals`).click();
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage().getByTestId(`navigation-button-Goals`).click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      // check if the subgoal is visible in receiver in the root goal
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });

      // again move the subgoal under the currentGoalTitle
      await sharerPage().getByTestId(`navigation-button-Goals`).click();
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      // check if the subgoal is visible in receiver under the currentGoalTitle
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });

      // suggesting changes from receiver to subgoal

      await receiverPage().goto("http://127.0.0.1:3000");
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();

      await receiverPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await receiverPage().getByTestId("zmodal").getByText("Move").click();
      await receiverPage().getByRole("button", { name: "Move goal" }).click();

      await receiverPage().getByRole("img", { name: "my goals" }).click();
      await receiverPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await receiverPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      await sharerPage().goto("http://127.0.0.1:3000/goals");

      // first verify that the notification dot exists
      await expectWithRetry(sharerPage(), async () => {
        await expect(sharerPage().getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible();
      });

      // then click on the goal icon
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add changes  Make all checked" }).click();
      await expectWithRetry(sharerPage(), async () => {
        await expect(sharerPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });

      await receiverPage().goto("http://127.0.0.1:3000/");
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();

      await expectWithRetry(sharerPage(), async () => {
        await expect(sharerPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
      });
    });

    test("move should work correct if private goal is present in the shared hierarchy", async () => {
      const privateGoalTitle = "Private Goal";
      const sharedSubgoalTitle = "Shared Subgoal";
      await sharerPage().goto("http://127.0.0.1:3000/goals");
      // create 3 goals
      await createGoalFromGoalPage(sharerPage(), privateGoalTitle);
      await createGoalFromGoalPage(sharerPage(), sharedSubgoalTitle);

      await sharerPage().waitForTimeout(1000);

      // move private goal into shared goal
      await sharerPage()
        .getByTestId(`goal-${privateGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      await sharerPage().getByTestId(`navigation-button-Goals`).click();

      // move subgoal into private goal
      await sharerPage()
        .getByTestId(`goal-${sharedSubgoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage()
        .getByTestId(`goal-${privateGoalTitle}`)
        .locator("div")
        .filter({ hasText: privateGoalTitle })
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      // share subgoal with receiver
      await shareGoalFlow(sharerPage(), sharedSubgoalTitle, receiver);

      // check if the subgoal is visible in receiver under the currentGoalTitle
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();
      });

      // move shared subgoal to root and check if it is visible in receiver in root only
      await sharerPage().getByTestId(`navigation-button-Goals`).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage()
        .getByTestId(`goal-${privateGoalTitle}`)
        .locator("div")
        .filter({ hasText: privateGoalTitle })
        .first()
        .click();

      await sharerPage()
        .getByTestId(`goal-${sharedSubgoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage().getByTestId(`navigation-button-Goals`).click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();
      });

      // now move the shared subgoal from root to private goal again
      await sharerPage().getByTestId(`navigation-button-Goals`).click();
      await sharerPage()
        .getByTestId(`goal-${sharedSubgoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage().getByTestId(`navigation-button-Goals`).click();

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await sharerPage()
        .getByTestId(`goal-${privateGoalTitle}`)
        .locator("div")
        .filter({ hasText: privateGoalTitle })
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL_SHARING);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage().getByTestId(`goal-${currentGoalTitle}`).locator("div").first().click();
      await expectWithRetry(receiverPage(), async () => {
        await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();
      });
    });
  });
});
