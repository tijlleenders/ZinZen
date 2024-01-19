import { test, expect, Page } from "@playwright/test";
import { shareGoalPrivately } from "./lib/testUtils";

const apiServerUrl = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
const apiServerUrlGoal = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";

test.describe.configure({ mode: "serial" });

test.describe("Goal Sharing Feature", () => {
  let userOneContext;
  let userTwoContext;
  let userOnePage: Page;
  let userTwoPage: Page;
  let inviationLink: string;

  test.beforeAll(async ({ browser }) => {
    userOneContext = await browser.newContext({
      storageState: "playwright/userOnboarding.json",
    });
    userTwoContext = await browser.newContext({
      storageState: "playwright/userOnboarding.json",
    });

    userTwoPage = await userTwoContext.newPage();
    userOnePage = await userOneContext.newPage();
  });

  test("add contact in user 1", async () => {
    await userOnePage.goto("http://127.0.0.1:3000/");
    await userOnePage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userOnePage);
    await userOnePage.getByRole("button", { name: "add contact", exact: true }).click();
    await userOnePage.getByPlaceholder("Name").click();
    await userOnePage.getByPlaceholder("Name").fill("User 2");
    await userOnePage.getByRole("button", { name: "add contact Share invitation" }).click();
    await Promise.all([
      userOnePage.waitForResponse(
        (res) =>
          res.status() === 200 &&
          res.url().includes(apiServerUrl) &&
          res.body().then((responseBody) => {
            return responseBody.includes("relId");
          }),
      ),
    ]);
    await userOnePage.goBack();
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await Promise.all([
      userOnePage.waitForResponse(
        (res) =>
          res.status() === 200 &&
          res.url().includes(apiServerUrl) &&
          res.body().then((responseBody) => {
            return responseBody.includes("relationshipId");
          }),
      ),
    ]);
    await userOnePage.waitForSelector(".ant-notification-notice");
    inviationLink = await userOnePage.evaluate("navigator.clipboard.readText()");
    await userOnePage.goto("http://127.0.0.1:3000/");
    await userOnePage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userOnePage);
  });

  test("add contact in user 2", async () => {
    await userTwoPage.goto(`${inviationLink}`);
    await userTwoPage.getByPlaceholder("Contact name").click();
    await userTwoPage.getByPlaceholder("Contact name").fill("User 1");
    await userTwoPage.getByRole("button", { name: "Add to my contacts" }).click();
    await Promise.all([
      userTwoPage.waitForResponse(
        (res) =>
          res.status() === 200 &&
          res.url().includes(apiServerUrl) &&
          res.body().then((responseBody) => {
            return responseBody.includes("accepted");
          }),
      ),
    ]);
  });

  test("share goal in user 1", async () => {
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await userOnePage.waitForSelector(".ant-notification-notice");
  });
  test("check goal in user 2", async () => {
    await userTwoPage.reload();
    await Promise.all([
      userTwoPage.waitForResponse(
        (res) =>
          res.status() === 200 &&
          res.url().includes(apiServerUrlGoal) &&
          res.body().then((responseBody) => {
            return responseBody.includes("shareMessage");
          }),
      ),
    ]);
    await userTwoPage.getByRole("img", { name: "ZinZen" }).click();
    await userTwoPage.reload();
    await expect(userTwoPage.locator(".user-goal-main")).toBeVisible();
  });
});
