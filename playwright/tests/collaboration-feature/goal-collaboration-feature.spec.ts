import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL, API_SERVER_URL_GOAL, STORAGE_STATE } from "playwright/config/constants";
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
  let currentGoalTitle: string;

  test.beforeAll(async ({ browser }) => {
    ({ page: userAPage } = await createUserContextAndPage(browser));
    ({ page: userBPage } = await createUserContextAndPage(browser));
    ({ page: userCPage } = await createUserContextAndPage(browser));
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByText("English").click();
    await userAPage.getByRole("button", { name: "Continue zinzen faq" }).click();
    await userBPage.goto("http://127.0.0.1:3000/");
    await userBPage.getByText("English").click();
    await userBPage.getByRole("button", { name: "Continue zinzen faq" }).click();
    await userCPage.goto("http://127.0.0.1:3000/");
    await userCPage.getByText("English").click();
    await userCPage.getByRole("button", { name: "Continue zinzen faq" }).click();
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
      await goToMyGoalsPageFlow(sharerPage());
      currentGoalTitle = await sharerPage().locator(".goal-title").first().locator("span").innerText();
      invitationLink = await addContact(sharerPage(), receiver, "relId", "relationshipId");
      await goToMyGoalsPageFlow(sharerPage());
      await goToShareGoalModalFlow(sharerPage());
    });

    test(`from User ${receiver} accept invitation of User ${sharer}`, async () => {
      await acceptContactInvitation(receiverPage(), invitationLink, receiver);
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL, "accepted");
    });

    test(`share goal from User ${receiver} to User ${sharer}`, async () => {
      await sharerPage().getByRole("button", { name: receiver, exact: true }).click();
      await sharerPage().waitForSelector(".ant-notification-notice");
    });

    test(`check whether shared goal is visible in User ${receiver}'s patner goal`, async () => {
      await receiverPage().reload();
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL, "shareMessage");
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().reload();
      await expect(receiverPage().locator(".user-goal-main")).toBeVisible();
    });

    test(`initiate collaboration between User ${sharer} and User ${receiver}`, async () => {
      await collaborateFlow(receiverPage());
    });

    test(`check if collaborated goal is visible in User ${receiver}'s MyGoal`, async () => {
      await receiverPage().goto("http://127.0.0.1:3000/");
      await receiverPage().getByRole("button", { name: "Goals" }).click();
      await expect(receiverPage().locator(".goal-title").first().locator("span")).toContainText(currentGoalTitle);
    });
  });

  editAndConfirmScenarios.forEach(
    ({ sharer, receiverFirst, receiverSecond, sharerPage, receiverPageFirst, receiverPageSecond }) => {
      test(`goal update by ${sharer}: edit goal in User ${sharer}`, async () => {
        await goToMyGoalsPageFlow(sharerPage());
        await goalActionFlow(sharerPage(), "Edit");
        await sharerPage().locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by ${sharer}`);
        await sharerPage().locator(".action-btn-container").locator(".action-btn").click();
        currentGoalTitle = await sharerPage().locator(".goal-title").first().locator("span").innerText();
      });

      test(`goal update by ${sharer}: check if User ${receiverFirst} received updated goal from User ${sharer}`, async () => {
        await verifyUpdatedGoal(receiverPageFirst(), currentGoalTitle, API_SERVER_URL_GOAL);
      });

      test(`goal update by ${sharer}: check if User ${receiverSecond} received updated goal from User ${sharer}`, async () => {
        await verifyUpdatedGoal(receiverPageSecond(), currentGoalTitle, API_SERVER_URL_GOAL);
      });
    },
  );
});
