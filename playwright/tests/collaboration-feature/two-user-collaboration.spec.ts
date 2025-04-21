import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL, API_SERVER_URL_GOAL } from "playwright/config/constants";
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

test.describe("Goal Sharing Feature", () => {
  let userAPage: Page;
  let userBPage: Page;
  let invitationLink: string;
  const currentGoalTitle = "Test Goal";
  const subgoalTitle = "Subgoal";
  const secondGoalTitle = "Second Shared Goal";
  test.beforeAll(async ({ browser }) => {
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
    await waitForResponseConfirmation(userBPage, API_SERVER_URL);

    console.log(`User A is sharing the goal with User B...`);
    await goToAppPage(userAPage, "Goals", true);

    console.log(`User A is opening the share goal modal for "${currentGoalTitle}"...`);
    await shareGoalFlow(userAPage, currentGoalTitle, "B");

    console.log(`User B is reloading the page to check for shared goal visibility...`);
    await userBPage.goto("http://127.0.0.1:3000/");
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL);
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.waitForTimeout(1000);
    await userBPage.reload();
    await userBPage.getByTestId(`contact-B`).locator("div").first().click();
    await expect(userBPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();

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

      await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeHidden();

      // share the subgoal with receiver
      await sharerPage().getByRole("button", { name: "Goals" }).click();
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      await shareGoalFlow(sharerPage(), subgoalTitle, receiver);

      // check if the subgoal is visible in receiver under the currentGoalTitle
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();
      await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();

      // move the subgoal to root goal
      await sharerPage().getByRole("button", { name: "Goals" }).click();
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage().getByRole("button", { name: "Goals" }).click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      // check if the subgoal is visible in receiver in the root goal
      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();

      // again move the subgoal under the currentGoalTitle
      await sharerPage().getByRole("button", { name: "Goals" }).click();
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
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();
      await expect(receiverPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();

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
      await expect(sharerPage().getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible();

      // then click on the goal icon
      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();

      await sharerPage().getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(sharerPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();

      await receiverPage().goto("http://127.0.0.1:3000/");
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();

      await expect(sharerPage().getByTestId(`goal-${subgoalTitle}`)).toBeVisible();
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

      await sharerPage().getByRole("button", { name: "Goals" }).click();

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
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .nth(1)
        .click();
      await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();

      // move shared subgoal to root and check if it is visible in receiver in root only
      await sharerPage().getByRole("button", { name: "Goals" }).click();

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

      await sharerPage().getByRole("button", { name: "Goals" }).click();

      await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      await receiverPage().goto("http://127.0.0.1:3000/");
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();

      // now move the shared subgoal from root to private goal again
      await sharerPage().getByRole("button", { name: "Goals" }).click();
      await sharerPage()
        .getByTestId(`goal-${sharedSubgoalTitle}`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      await sharerPage().getByRole("button", { name: "Goals" }).click();

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
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().getByTestId(`contact-${receiver}`).locator("div").first().click();
      await receiverPage().getByTestId(`goal-${currentGoalTitle}`).locator("div").first().click();
      await expect(receiverPage().getByTestId(`goal-${sharedSubgoalTitle}`)).toBeVisible();
    });
  });
});
