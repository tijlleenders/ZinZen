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

test.describe.configure({ mode: "serial", timeout: 100000 });

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
  });

  test.afterAll(async () => {
    console.log("Closing all user pages...");
    await userAPage.close();
    await userBPage.close();
  });

  const userCollaborationScenarios = [
    { sharer: "A", receiver: "B", sharerPage: () => userAPage, receiverPage: () => userBPage },
  ];

  const editAndConfirmScenarios = [
    {
      sharer: "A",
      receiverFirst: "B",
      sharerPage: () => userAPage,
      receiverPageFirst: () => userBPage,
    },
    {
      sharer: "B",
      receiverFirst: "A",
      sharerPage: () => userBPage,
      receiverPageFirst: () => userAPage,
    },
  ];

  userCollaborationScenarios.forEach(({ sharer, receiver, sharerPage, receiverPage }) => {
    test(`from User ${sharer} share invitation to User ${receiver}`, async () => {
      console.log(`User ${sharer} is navigating to their goals page...`);
      await goToAppPage(sharerPage(), "Goals", true);

      if (sharer === "A") {
        console.log(`User ${sharer} is creating a new goal titled "${currentGoalTitle}"...`);
        await createGoalFromGoalPage(sharerPage(), currentGoalTitle);
      }

      console.log(`User ${sharer} is adding User ${receiver} as a contact...`);
      invitationLink = await addContact(sharerPage(), receiver, currentGoalTitle);
    });

    test(`from User ${receiver} accept invitation of User ${sharer}`, async () => {
      console.log(`User ${receiver} is accepting the invitation from User ${sharer}...`);
      await acceptContactInvitation(receiverPage(), invitationLink, receiver);
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL);
    });

    test(`share goal from User ${receiver} to User ${sharer}`, async () => {
      console.log(`User ${sharer} is sharing the goal with User ${receiver}...`);
      await goToAppPage(sharerPage(), "Goals", true);

      console.log(`User ${sharer} is opening the share goal modal for "${currentGoalTitle}"...`);
      await goToShareGoalModalFlow(sharerPage(), currentGoalTitle);
      await expect(async () => {
        await sharerPage().getByRole("button", { name: receiver, exact: true }).click();
        await sharerPage().waitForSelector(".share-modal", { state: "hidden" });
        await sharerPage().waitForSelector(`text=Cheers!! Your goal and its subgoals are shared with ${receiver}`);
      }).toPass({
        timeout: 10_000,
      });
    });

    test(`check whether shared goal is visible in User ${receiver}'s partner goal`, async () => {
      console.log(`User ${receiver} is reloading the page to check for shared goal visibility...`);
      await receiverPage().reload();
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().waitForTimeout(1000);
      await receiverPage().reload();
      await expect(receiverPage().locator(".user-goal-main")).toBeVisible();
    });

    test("sharer moves a subgoal into shared goal and check if it is not visible in User receiver MyGoal", async () => {
      console.log(`User ${sharer} is moving a subgoal into the shared goal...`);
      await sharerPage().goto("http://127.0.0.1:3000/goals");
      await createGoalFromGoalPage(sharerPage(), subgoalTitle);

      await sharerPage().waitForTimeout(1000);
      //
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Move").click();
      await sharerPage().getByRole("button", { name: "Move goal" }).click();

      //
      // await sharerPage()
      //   .getByTestId(`goal-${subgoalTitle}`)
      //   .getByTestId("goal-icon")
      //   .locator(".user-goal-main > .goal-tile")
      //   .click();
      // await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
      // await sharerPage().getByRole("button", { name: "Move here add goal", exact: true }).click();

      //

      await sharerPage()
        .getByTestId(`goal-${currentGoalTitle}`)
        .locator("div")
        .filter({ hasText: currentGoalTitle })
        .first()
        .click();

      // await sharerPage().getByText(currentGoalTitle).click();
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
    });

    test("sharer shares the moved subgoal with User receiver and check if it is visible in User receiver MyGoal", async () => {
      console.log(`User ${sharer} is moving a subgoal into the shared goal...`);
      await sharerPage().getByTestId(`goal-${subgoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await sharerPage().getByTestId("zmodal").getByText("Share").click();

      await expect(async () => {
        await sharerPage().getByRole("button", { name: receiver, exact: true }).click();
        await sharerPage().waitForSelector(".share-modal", { state: "hidden" });
        await sharerPage().waitForSelector(`text=Cheers!! Your goal and its subgoals are shared with ${receiver}`);
      }).toPass({
        timeout: 10_000,
      });

      await receiverPage().reload();
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
    });
  });

  test("sharer moves shared subgoal into another shared goal and check if it is visible in User receiver MyGoal", async () => {
    // create a new goal in sender's MyGoal

    await goToAppPage(userAPage, "Goals", true);
    await createGoalFromGoalPage(userAPage, secondGoalTitle);

    await userAPage.waitForTimeout(10000);
    // share the second goal with receiver
    // await goToShareGoalModalFlow(userAPage, secondGoalTitle);

    await userAPage.getByTestId(`goal-${secondGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
    await userAPage.getByTestId("zmodal").getByTestId("share-action").click();

    await expect(async () => {
      await userAPage.getByRole("button", { name: "B", exact: true }).click();
      await userAPage.waitForSelector(".share-modal", { state: "hidden" });
      await userAPage.waitForSelector(`text=Cheers!! Your goal and its subgoals are shared with B`);
    }).toPass({
      timeout: 10_000,
    });

    await userAPage.goBack();

    // move the subgoal into the second shared goal
    await userAPage.getByTestId(`goal-${secondGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
    await userAPage.getByTestId("zmodal").getByText("Move").click();
    await userAPage.getByRole("button", { name: "Move goal" }).click();
    await userAPage
      .getByTestId(`goal-${currentGoalTitle}`)
      .locator("div")
      .filter({ hasText: currentGoalTitle })
      .first()
      .click();

    await userAPage
      .getByTestId(`goal-${subgoalTitle}`)
      .locator("div")
      .filter({ hasText: subgoalTitle })
      .first()
      .click();
    await userAPage.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
    await userAPage.getByRole("button", { name: "Move here add goal", exact: true }).click();

    // check if the moved subgoal is visible in receiver's view of the second shared goal
    await userBPage.goto("http://127.0.0.1:3000");
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.getByTestId("contact-B").locator("div").first().click();
    await userBPage
      .getByTestId(`goal-${currentGoalTitle}`)
      .locator("div")
      .filter({ hasText: currentGoalTitle })
      .nth(1)
      .click();
    await userBPage.getByTestId(`goal-${subgoalTitle}`).locator("div").filter({ hasText: subgoalTitle }).nth(1).click();
    await expect(userBPage.getByTestId(`goal-${secondGoalTitle}`)).toBeVisible();
  });
});
