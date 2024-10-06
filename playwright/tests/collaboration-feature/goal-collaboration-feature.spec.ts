import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL, API_SERVER_URL_GOAL } from "playwright/config/constants";
import {
  acceptContactInvitation,
  addContact,
  collaborateFlow,
  createUserContextAndPage,
  goToMyGoalsPageFlow,
  goToShareGoalModalFlow,
  goalActionFlow,
  verifyUpdatedGoal,
  waitForResponseConfirmation,
} from "../../utils/collaboration-feature-utils";

test.describe.configure({ mode: "serial", timeout: 100000 });

test.describe("Goal Sharing Feature", () => {
  let userAPage: Page;
  let userBPage: Page;
  let userCPage: Page;
  let invitationLink: string;
  let currentGoalTitle = "Test Goal";

  test.beforeAll(async ({ browser }) => {
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
  });

  test.afterAll(async () => {
    console.log("Closing all user pages...");
    await userAPage.close();
    await userBPage.close();
    await userCPage.close();
  });

  const userCollaborationScenarios = [
    { sharer: "A", receiver: "B", sharerPage: () => userAPage, receiverPage: () => userBPage },
    { sharer: "B", receiver: "C", sharerPage: () => userBPage, receiverPage: () => userCPage },
  ];

  const editAndConfirmScenarios = [
    {
      sharer: "A",
      receiverFirst: "B",
      receiverSecond: "C",
      sharerPage: () => userAPage,
      receiverPageFirst: () => userBPage,
      receiverPageSecond: () => userCPage,
    },
    {
      sharer: "B",
      receiverFirst: "C",
      receiverSecond: "A",
      sharerPage: () => userBPage,
      receiverPageFirst: () => userCPage,
      receiverPageSecond: () => userAPage,
    },
    {
      sharer: "C",
      receiverFirst: "B",
      receiverSecond: "A",
      sharerPage: () => userCPage,
      receiverPageFirst: () => userBPage,
      receiverPageSecond: () => userAPage,
    },
  ];

  userCollaborationScenarios.forEach(({ sharer, receiver, sharerPage, receiverPage }) => {
    test(`from User ${sharer} share invitation to User ${receiver}`, async () => {
      console.log(`User ${sharer} is navigating to their goals page...`);
      await goToMyGoalsPageFlow(sharerPage());

      if (sharer === "A") {
        console.log(`User ${sharer} is creating a new goal titled "${currentGoalTitle}"...`);
        await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
        const titleInputContainer = sharerPage().getByPlaceholder("Goal title");
        await titleInputContainer.fill(currentGoalTitle);
        await titleInputContainer.press("Enter");
      }

      console.log(`User ${sharer} is adding User ${receiver} as a contact...`);
      invitationLink = await addContact(sharerPage(), receiver, currentGoalTitle);

      console.log(`User ${sharer} is navigating to their goals page again...`);
      await goToMyGoalsPageFlow(sharerPage());

      console.log(`User ${sharer} is opening the share goal modal for "${currentGoalTitle}"...`);
      await goToShareGoalModalFlow(sharerPage(), currentGoalTitle);
    });

    test(`from User ${receiver} accept invitation of User ${sharer}`, async () => {
      console.log(`User ${receiver} is accepting the invitation from User ${sharer}...`);
      await acceptContactInvitation(receiverPage(), invitationLink, receiver);
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL);
    });

    test(`share goal from User ${receiver} to User ${sharer}`, async () => {
      console.log(`User ${sharer} is sharing the goal with User ${receiver}...`);
      await goToMyGoalsPageFlow(sharerPage());

      console.log(`User ${sharer} is opening the share goal modal for "${currentGoalTitle}"...`);
      await goToShareGoalModalFlow(sharerPage(), currentGoalTitle);
      await expect(async () => {
        await sharerPage().getByRole("button", { name: receiver, exact: true }).click();
        await sharerPage().waitForLoadState("networkidle");
      }).toPass({
        timeout: 10_000,
      });
    });

    test(`check whether shared goal is visible in User ${receiver}'s partner goal`, async () => {
      console.log(`User ${receiver} is reloading the page to check for shared goal visibility...`);
      await receiverPage().reload();
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().reload();
      await expect(receiverPage().locator(".user-goal-main")).toBeVisible();
    });

    test(`initiate collaboration between User ${sharer} and User ${receiver}`, async () => {
      console.log(`Initiating collaboration between User ${sharer} and User ${receiver}...`);
      await collaborateFlow(receiverPage(), currentGoalTitle);
    });

    test(`check if collaborated goal is visible in User ${receiver}'s MyGoal`, async () => {
      console.log(`Checking if collaborated goal is visible in User ${receiver}'s MyGoal...`);
      await goToMyGoalsPageFlow(receiverPage());
      await expect(receiverPage().locator(".my-goals-content").first()).toContainText(currentGoalTitle);
    });
  });

  editAndConfirmScenarios.forEach(
    ({ sharer, receiverFirst, receiverSecond, sharerPage, receiverPageFirst, receiverPageSecond }) => {
      test(`goal update by ${sharer}: edit goal in User ${sharer}`, async () => {
        console.log(`User ${sharer} is updating the goal "${currentGoalTitle}"...`);
        await expect(async () => {
          await goToMyGoalsPageFlow(sharerPage());
          await goalActionFlow(sharerPage(), "Edit", currentGoalTitle);
          await sharerPage().locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by ${sharer}`);
          await sharerPage().locator(".action-btn-container").locator(".action-btn").click();
        }).toPass();

        console.log(`Getting the updated goal title from User ${sharer}'s page...`);
        currentGoalTitle = await sharerPage()
          .locator(".user-goal-dark")
          .filter({
            has: sharerPage().locator(".contact-button"),
          })
          .locator(".goal-title span")
          .innerText();
      });

      test(`goal update by ${sharer}: check if User ${receiverFirst} received updated goal from User ${sharer}`, async () => {
        console.log(`Checking if User ${receiverFirst} received the updated goal from User ${sharer}...`);
        await verifyUpdatedGoal(receiverPageFirst(), currentGoalTitle, API_SERVER_URL_GOAL);
      });

      test(`goal update by ${sharer}: check if User ${receiverSecond} received updated goal from User ${sharer}`, async () => {
        console.log(`Checking if User ${receiverSecond} received the updated goal from User ${sharer}...`);
        await verifyUpdatedGoal(receiverPageSecond(), currentGoalTitle, API_SERVER_URL_GOAL);
      });
    },
  );
});
