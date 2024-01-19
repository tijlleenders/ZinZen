import { test, expect, Page } from "@playwright/test";
import { API_SERVER_URL, API_SERVER_URL_GOAL } from "playwright/config/constants";
import {
  acceptContactInvitation,
  addContact,
  goToMyGoalsPageFlow,
  goToShareGoalModalFlow,
  waitForResponseConfirmation,
} from "playwright/utils/collaboration-feature-utils";

const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
const apiServerUrlGoal = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";

test.describe.configure({ mode: "serial" });

test.describe("Goal Sharing Feature", () => {
  let userOneContext;
  let userTwoContext;
  let userOnePage: Page;
  let userTwoPage: Page;
  let invitationLink: string;
  let currentGoalTitle: string;

  test.beforeAll(async ({ browser }) => {
    userOneContext = await browser.newContext({
      storageState: "playwright/userOnboarding.json",
    });
    userTwoContext = await browser.newContext({
      storageState: "playwright/userOnboarding.json",
    });

    userOnePage = await userOneContext.newPage();
    userTwoPage = await userTwoContext.newPage();
  });

  test("from User One share invitation to User Two", async () => {
    await goToMyGoalsPageFlow(userOnePage);
    currentGoalTitle = await userOnePage.locator(".goal-title").first().locator("span").innerText();
    invitationLink = await addContact(userOnePage, "User Two", "relId", "relationshipId");
    await goToMyGoalsPageFlow(userOnePage);
    await goToShareGoalModalFlow(userOnePage);
  });

  test("from User Two accept invitation of User One", async () => {
    await acceptContactInvitation(userTwoPage, invitationLink, "User Two");
    await waitForResponseConfirmation(userTwoPage, API_SERVER_URL, "accepted");
  });

  test("share goal from User One to User Two", async () => {
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await userOnePage.waitForSelector(".ant-notification-notice");
  });

  test("check whether shared goal is visible in User Two's patner goal", async () => {
    await userTwoPage.reload();
    await waitForResponseConfirmation(userTwoPage, API_SERVER_URL_GOAL, "shareMessage");
    await userTwoPage.getByRole("img", { name: "ZinZen" }).click();
    await userTwoPage.reload();
    await expect(userTwoPage.locator(".user-goal-main")).toBeVisible();
  });
});
