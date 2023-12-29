import { test, expect, Page } from "@playwright/test";
import {
  acceptContactInvitation,
  addContact,
  collaborateFlow,
  createUserContextAndPage,
  shareGoalPrivately,
  waitForSpecificResponse,
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

  test("add contact in user 1", async () => {
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByRole("button", { name: "Goals" }).click();
    userAPageGoalTitle = await userAPage.locator(".goal-title").first().locator("span").innerText();
    invitationLink = await addContact(userAPage, "B", "relId", "relationshipId", true);
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userAPage);
  });

  test("add contact in user 2", async () => {
    await acceptContactInvitation(userBPage, invitationLink, "B");
    await waitForSpecificResponse(userBPage, apiServerUrl, "accepted");
  });

  test("share goal in user 1", async () => {
    await userAPage.getByRole("button", { name: "U", exact: true }).click();
    await userAPage.waitForSelector(".ant-notification-notice");
  });

  test("check goal in user 2", async () => {
    await userBPage.reload();
    await waitForSpecificResponse(userBPage, apiServerUrlGoal, "shareMessage");
    await userBPage.getByRole("img", { name: "ZinZen" }).click();
    await userBPage.reload();
    await expect(userBPage.locator(".user-goal-main")).toBeVisible();
  });

  test("collaboration between user1 and user2", async () => {
    await collaborateFlow(userBPage);
  });

  test("check colloborated goal in user 2 myGoals", async () => {
    await userBPage.getByRole("button", { name: "Goals" }).click();
    await expect(userBPage.locator(".goal-title").first().locator("span")).toContainText(userAPageGoalTitle);
    invitationLink = await addContact(userBPage, "C", "relId", "relationshipId", false);
    await userBPage.goto("http://127.0.0.1:3000/");
    await userBPage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userBPage);
  });

  test("add contact in user 3", async () => {
    await acceptContactInvitation(userCPage, invitationLink, "C");
    await waitForSpecificResponse(userCPage, apiServerUrl, "accepted");
  });

  test("share goal in user 2", async () => {
    await userBPage.locator("div").filter({ hasText: /^CC$/ }).getByRole("button").click();
    await userBPage.waitForSelector(".ant-notification-notice");
  });

  test("check goal in user 3", async () => {
    await userCPage.reload();
    await waitForSpecificResponse(userCPage, apiServerUrlGoal, "shareMessage");
    await userCPage.getByRole("img", { name: "ZinZen" }).click();
    await userCPage.reload();
    await expect(userCPage.locator(".user-goal-main")).toBeVisible();
  });

  test("collaboration between user2 and user3", async () => {
    await collaborateFlow(userCPage);

    await userCPage.getByRole("button", { name: "Goals" }).click();
    await expect(userCPage.locator(".goal-title").first().locator("span")).toContainText(userAPageGoalTitle);
  });

  test("edit goal in user 1 and check changes in user 2", async () => {
    await userAPage.goto("http://127.0.0.1:3000/");
    await userAPage.getByRole("button", { name: "Goals" }).click();
    await userAPage.locator(".goal-dd-outer").first().click();
    await userAPage
      .locator("div")
      .filter({ hasText: /^Edit$/ })
      .first()
      .click();
    await userAPage.locator(".header-title").locator("input").fill(`${userAPageGoalTitle} edited by user 1`);
    await userAPage.locator(".action-btn-container").locator(".action-btn").click();
    userAPageGoalTitle = await userAPage.locator(".goal-title").first().locator("span").innerText();

    await userBPage.goto("http://127.0.0.1:3000/");
    await Promise.all([
      userBPage.waitForResponse((res) => res.status() === 200 && res.url().includes(apiServerUrlGoal)),
    ]);

    await userBPage.getByRole("button", { name: "Goals" }).click();
    await userBPage.locator(".goal-dd-outer").first().click();
    await expect(userBPage.getByText(userAPageGoalTitle).first()).toBeVisible();
    await userBPage.getByRole("button", { name: "add changes Make all checked" }).click();
    await expect(userBPage.getByText(userAPageGoalTitle).first()).toBeVisible();
  });

  test("check if user 3 received updated goal from user 2", async () => {
    await userCPage.goto("http://127.0.0.1:3000/");
    await Promise.all([
      userCPage.waitForResponse((res) => res.status() === 200 && res.url().includes(apiServerUrlGoal)),
    ]);
    await userCPage.getByRole("button", { name: "Goals" }).click();
    await userCPage.locator(".goal-dd-outer").first().click();
    await expect(userCPage.getByText(userAPageGoalTitle).first()).toBeVisible();
    await userCPage.getByRole("button", { name: "add changes Make all checked" }).click();
    await expect(userCPage.getByText(userAPageGoalTitle).first()).toBeVisible();
  });
});
