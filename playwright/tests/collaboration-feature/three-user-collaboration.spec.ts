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
    await waitForResponseConfirmation(userBPage, API_SERVER_URL_RELATIONSHIPS);

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
    await expect(userBPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();

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
    await expect(userCPage.getByTestId(`goal-${currentGoalTitle}`)).toBeVisible();

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
    test("check if collaboration works between users correctly", async () => {
      await userAPage.goto("http://127.0.0.1:3000/goals");

      await userAPage.getByRole("button", { name: "Goals" }).click();
      await userAPage.getByTestId(`goal-${currentGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userAPage.getByTestId("zmodal").getByText("Edit").click();
      await userAPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by A`);
      await userAPage.locator(".ant-modal-wrap").click();

      await userBPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userBPage.getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible();
      await userBPage.getByTestId(`goal-${currentGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userBPage.getByRole("button", { name: "add changes  Make all checked" }).click();

      await expect(userBPage.getByTestId(`goal-${currentGoalTitle} edited by A`)).toBeVisible();

      await userCPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userCPage.getByTestId(`notification-dot-${currentGoalTitle}`)).toBeVisible();
      await userCPage.getByTestId(`goal-${currentGoalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await userCPage.getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(userCPage.getByTestId(`goal-${currentGoalTitle} edited by A`)).toBeVisible();

      await userBPage.getByRole("button", { name: "Goals" }).click();
      await userBPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userBPage.getByTestId("zmodal").getByText("Edit").first().click();
      await userBPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by B`);
      await userBPage.locator(".ant-modal-wrap").click();

      await userBPage.waitForTimeout(1000);

      await userCPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userCPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userCPage.getByTestId(`notification-dot-${currentGoalTitle} edited by A`)).toBeVisible();
      await userCPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userCPage.getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(userCPage.getByTestId(`goal-${currentGoalTitle} edited by B`)).toBeVisible();

      await userAPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userAPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userAPage.getByTestId(`notification-dot-${currentGoalTitle} edited by A`)).toBeVisible();
      await userAPage
        .getByTestId(`goal-${currentGoalTitle} edited by A`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userAPage.getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(userAPage.getByTestId(`goal-${currentGoalTitle} edited by B`)).toBeVisible();

      await userCPage.getByRole("button", { name: "Goals" }).click();
      await userCPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userCPage.getByTestId("zmodal").getByText("Edit").first().click();
      await userCPage.locator(".header-title").locator("input").fill(`${currentGoalTitle} edited by C`);
      await userCPage.locator(".ant-modal-wrap").click();

      await userCPage.waitForTimeout(1000);

      await userBPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userBPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userBPage.getByTestId(`notification-dot-${currentGoalTitle} edited by B`)).toBeVisible();
      await userBPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userBPage.getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(userBPage.getByTestId(`goal-${currentGoalTitle} edited by C`)).toBeVisible();

      await userBPage.waitForTimeout(1000);

      await userAPage.goto("http://127.0.0.1:3000/goals");
      await waitForResponseConfirmation(userAPage, API_SERVER_URL_GOAL_SHARING);

      await expect(userAPage.getByTestId(`notification-dot-${currentGoalTitle} edited by B`)).toBeVisible();
      await userAPage
        .getByTestId(`goal-${currentGoalTitle} edited by B`)
        .getByTestId("goal-icon")
        .locator("div")
        .first()
        .click();
      await userAPage.getByRole("button", { name: "add changes  Make all checked" }).click();
      await expect(userAPage.getByTestId(`goal-${currentGoalTitle} edited by C`)).toBeVisible();
    });
  });
});
