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

test.describe.configure({ mode: "serial" });

test.describe("Goal Sharing Feature", () => {
  let userAContext;
  let userBContext;
  let userCContext;
  let userAPage: Page;
  let userBPage: Page;
  let userCPage: Page;
  let invitationLink: string;

  let userAPageGoalTitle: string;

  test.beforeAll(async ({ browser }) => {
    ({ context: userAContext, page: userAPage } = await createUserContextAndPage(browser, STORAGE_STATE));
    ({ context: userBContext, page: userBPage } = await createUserContextAndPage(browser, STORAGE_STATE));
    ({ context: userCContext, page: userCPage } = await createUserContextAndPage(browser, STORAGE_STATE));
  });

  const userScenarios = [
    { sharer: "A", receiver: "B", sharerPage: () => userAPage, receiverPage: () => userBPage },
    { sharer: "B", receiver: "C", sharerPage: () => userBPage, receiverPage: () => userCPage },
  ];

  const editAndConfirmScenarios = [
    {
      sharer: "A",
      receiver: "B",
      receiverTwo: "C",
      sharerPage: () => userAPage,
      receiverPageFirst: () => userBPage,
      receiverPageSecond: () => userCPage,
    },
    {
      sharer: "B",
      receiver: "C",
      receiverTwo: "A",
      sharerPage: () => userBPage,
      receiverPageFirst: () => userCPage,
      receiverPageSecond: () => userAPage,
    },
    {
      sharer: "C",
      receiver: "B",
      receiverTwo: "A",
      sharerPage: () => userCPage,
      receiverPageFirst: () => userBPage,
      receiverPageSecond: () => userAPage,
    },
  ];

  userScenarios.forEach(({ sharer, receiver, sharerPage, receiverPage }) => {
    test(`from User ${sharer} share invitation to User ${receiver}`, async () => {
      await goToMyGoalsPageFlow(sharerPage());
      userAPageGoalTitle = await sharerPage().locator(".goal-title").first().locator("span").innerText();
      const isFirstContact = sharer === "A";
      invitationLink = await addContact(sharerPage(), receiver, "relId", "relationshipId", isFirstContact);
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
      await receiverPage().getByRole("button", { name: "Goals" }).click();
      await expect(receiverPage().locator(".goal-title").first().locator("span")).toContainText(userAPageGoalTitle);
    });
  });

  editAndConfirmScenarios.forEach(
    ({ sharer, receiver, receiverTwo, sharerPage, receiverPageFirst, receiverPageSecond }) => {
      test(`goal update by ${sharer}: edit goal in User ${sharer}`, async () => {
        await goToMyGoalsPageFlow(sharerPage());
        await goalActionFlow(sharerPage(), "Edit");
        await sharerPage().locator(".header-title").locator("input").fill(`${userAPageGoalTitle} edited by ${sharer}`);
        await sharerPage().locator(".action-btn-container").locator(".action-btn").click();
        userAPageGoalTitle = await sharerPage().locator(".goal-title").first().locator("span").innerText();
      });

      test(`goal update by ${sharer}: check if User ${receiver} received updated goal from User ${sharer}`, async () => {
        await verifyUpdatedGoal(receiverPageFirst(), userAPageGoalTitle, API_SERVER_URL_GOAL);
      });

      test(`goal update by ${sharer}: check if User ${receiverTwo} received updated goal from User ${sharer}`, async () => {
        await verifyUpdatedGoal(receiverPageSecond(), userAPageGoalTitle, API_SERVER_URL_GOAL);
      });
    },
  );

  // test("goal update by A: edit goal in user A", async () => {
  //   await goToMyGoalsPageFlow(userAPage);
  //   await goalActionFlow(userAPage, "Edit");
  //   await userAPage.locator(".header-title").locator("input").fill(`${userAPageGoalTitle} edited by user 1`);
  //   await userAPage.locator(".action-btn-container").locator(".action-btn").click();
  //   userAPageGoalTitle = await userAPage.locator(".goal-title").first().locator("span").innerText();
  // });

  // test("goal update by A: check if user B received updated goal from user A", async () => {
  //   await verifyUpdatedGoal(userBPage, userAPageGoalTitle, API_SERVER_URL_GOAL);
  // });

  // test("goal update by A: check if user C received updated goal from user B", async () => {
  //   await verifyUpdatedGoal(userCPage, userAPageGoalTitle, API_SERVER_URL_GOAL);
  // });

  // test("goal update by B: edit goal in User B", async () => {
  //   await goToMyGoalsPageFlow(userBPage);
  //   await goalActionFlow(userBPage, "Edit");
  //   await userBPage.locator(".header-title").locator("input").fill(`${userAPageGoalTitle} edited by user 2`);
  //   await userBPage.locator(".action-btn-container").locator(".action-btn").click();
  //   userAPageGoalTitle = await userBPage.locator(".goal-title").first().locator("span").innerText();
  // });

  // test("goal update by B: check if user C received updated goal from user B", async () => {
  //   await verifyUpdatedGoal(userCPage, userAPageGoalTitle, API_SERVER_URL_GOAL);
  // });

  // test("goal update by B: check if user A received updated goal from user B", async () => {
  //   await verifyUpdatedGoal(userAPage, userAPageGoalTitle, API_SERVER_URL_GOAL);
  // });
});
