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

  test.afterAll(async () => {
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
      await goToMyGoalsPageFlow(sharerPage());
      if (sharer === "A") {
        await sharerPage().getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click({});

        const titleInputContainer = sharerPage().getByPlaceholder("Goal title");
        await titleInputContainer.fill(currentGoalTitle);
        await titleInputContainer.press("Enter");
      }
      invitationLink = await addContact(sharerPage(), receiver, currentGoalTitle);
      await goToMyGoalsPageFlow(sharerPage());
      await goToShareGoalModalFlow(sharerPage(), currentGoalTitle);
    });

    test(`from User ${receiver} accept invitation of User ${sharer}`, async () => {
      await acceptContactInvitation(receiverPage(), invitationLink, receiver);
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL);
    });

    test(`share goal from User ${receiver} to User ${sharer}`, async () => {
      await sharerPage().getByRole("button", { name: receiver, exact: true }).click();
      await sharerPage().waitForSelector(".ant-notification-notice");
    });

    test(`check whether shared goal is visible in User ${receiver}'s patner goal`, async () => {
      await receiverPage().reload();
      await waitForResponseConfirmation(receiverPage(), API_SERVER_URL_GOAL);
      await receiverPage().getByRole("img", { name: "ZinZen" }).click();
      await receiverPage().reload();
      await expect(receiverPage().locator(".user-goal-main")).toBeVisible();
    });

    test(`initiate collaboration between User ${sharer} and User ${receiver}`, async () => {
      await receiverPage().waitForLoadState("networkidle", { timeout: 5000 });
      await collaborateFlow(receiverPage(), currentGoalTitle);
    });

    test(`check if collaborated goal is visible in User ${receiver}'s MyGoal`, async () => {
      await receiverPage().goto("http://127.0.0.1:3000/");
      await receiverPage().getByRole("button", { name: "Goals" }).click();
      const userGoalWithContact = receiverPage()
        .locator(".user-goal-dark")
        .filter({
          has: receiverPage().locator(".contact-icon"),
        });

      await expect(userGoalWithContact.locator(".goal-title span")).toContainText(currentGoalTitle);
    });
  });

  editAndConfirmScenarios.forEach(
    ({ sharer, receiverFirst, receiverSecond, sharerPage, receiverPageFirst, receiverPageSecond }) => {
      test(`goal update by ${sharer}: edit goal in User ${sharer}`, async () => {
        await goToMyGoalsPageFlow(sharerPage());
        await goalActionFlow(sharerPage(), "Edit", currentGoalTitle);
        await sharerPage().locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by ${sharer}`);
        await sharerPage().locator(".action-btn-container").locator(".action-btn").click();
        // Locate the .goal-title span within the user-goal-dark div that also contains the .contact-icon
        currentGoalTitle = await sharerPage()
          .locator(".user-goal-dark")
          .filter({
            has: sharerPage().locator(".contact-icon"),
          })
          .locator(".goal-title span")
          .innerText();
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
