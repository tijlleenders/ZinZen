import { test, expect, Page } from "@playwright/test";
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
} from "./lib/testUtils";

const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
const apiServerUrlGoal = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";

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
    const storageState = "playwright/userOnboarding.json";
    ({ context: userAContext, page: userAPage } = await createUserContextAndPage(browser, storageState));
    ({ context: userBContext, page: userBPage } = await createUserContextAndPage(browser, storageState));
    ({ context: userCContext, page: userCPage } = await createUserContextAndPage(browser, storageState));
  });

  test("from User A share invitation to User B", async () => {
    await goToMyGoalsPageFlow(userAPage);
    userAPageGoalTitle = await userAPage.locator(".goal-title").first().locator("span").innerText();
    invitationLink = await addContact(userAPage, "B", "relId", "relationshipId", true);
    await goToMyGoalsPageFlow(userAPage);
    await goToShareGoalModalFlow(userAPage);
  });

  test("from User B accept invitation of User A", async () => {
    await acceptContactInvitation(userBPage, invitationLink, "B");
    await waitForResponseConfirmation(userBPage, apiServerUrl, "accepted");
  });

  test("share goal from User A to User B", async () => {
    await userAPage.getByRole("button", { name: "B", exact: true }).click();
    await userAPage.waitForSelector(".ant-notification-notice");
  });

  test("check whether shared goal is visible in User B's patner goal", async () => {
    await userBPage.reload();
    await waitForResponseConfirmation(userBPage, apiServerUrlGoal, "shareMessage");
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.reload();
    await expect(userBPage.locator(".user-goal-main")).toBeVisible();
  });

  test("initiate collaboration between User A and User B", async () => {
    await collaborateFlow(userBPage);
  });

  test("check if collaborated goal is visible in User B's MyGoal", async () => {
    await userBPage.getByRole("button", { name: "Goals" }).click();
    await expect(userBPage.locator(".goal-title").first().locator("span")).toContainText(userAPageGoalTitle);
  });

  test("from User B share invitation to User C", async () => {
    invitationLink = await addContact(userBPage, "C", "relId", "relationshipId", false);
    await goToMyGoalsPageFlow(userBPage);
    await goToShareGoalModalFlow(userBPage);
  });

  test("from User C accept invitation of User B", async () => {
    await acceptContactInvitation(userCPage, invitationLink, "C");
    await waitForResponseConfirmation(userCPage, apiServerUrl, "accepted");
  });

  test("share goal from User B to User C", async () => {
    await userBPage.locator("div").filter({ hasText: /^CC$/ }).getByRole("button").click();
    await userBPage.waitForSelector(".ant-notification-notice");
  });

  test("check whether shared goal is visible in User C's patner goal", async () => {
    await userCPage.reload();
    await waitForResponseConfirmation(userCPage, apiServerUrlGoal, "shareMessage");
    await userCPage.getByRole("img", { name: "ZinZen" }).click();
    await userCPage.reload();
    await expect(userCPage.locator(".user-goal-main")).toBeVisible();
  });

  test("initiate collaboration between User B and User C", async () => {
    await collaborateFlow(userCPage);
  });

  test("check if collaborated goal is visible in User C's MyGoal", async () => {
    await userCPage.getByRole("button", { name: "Goals" }).click();
    await expect(userCPage.locator(".goal-title").first().locator("span")).toContainText(userAPageGoalTitle);
  });

  test("edit goal in user A", async () => {
    await goToMyGoalsPageFlow(userAPage);
    await goalActionFlow(userAPage, "Edit");
    await userAPage.locator(".header-title").locator("input").fill(`${userAPageGoalTitle} edited by user 1`);
    await userAPage.locator(".action-btn-container").locator(".action-btn").click();
    userAPageGoalTitle = await userAPage.locator(".goal-title").first().locator("span").innerText();
  });

  test("check if user B received updated goal from user A", async () => {
    await verifyUpdatedGoal(userBPage, userAPageGoalTitle, apiServerUrlGoal);
  });

  test("check if user C received updated goal from user B", async () => {
    await verifyUpdatedGoal(userCPage, userAPageGoalTitle, apiServerUrlGoal);
  });
});
