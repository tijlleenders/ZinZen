// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, Page } from "@playwright/test";
import { shareGoalPrivately } from "./lib/testUtils";

const apiServerUrl = "https://n65hkx5nehmmkzy5wp6ijyarka0qujrj.lambda-url.eu-west-1.on.aws/";

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
  test("check inbox in user 2", async () => {
    await userTwoPage.getByRole("button", { name: "Goals" }).click();
    await userTwoPage.reload();
    await userTwoPage.getByRole("img", { name: "zinzen inbox" }).click();
    await expect(userTwoPage.locator(".user-goal-main")).toBeVisible();
  });
});
