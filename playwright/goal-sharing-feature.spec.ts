// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, Page } from "@playwright/test";
import { shareGoalPrivately } from "./lib/testUtils";

test.describe.configure({ mode: "serial" });

test.describe("Goal Sharing Feature", () => {
  test.setTimeout(40000);
  let userOneContext;
  let userTwoContext;
  let userOnePage: Page;
  let userTwoPage: Page;
  let link: string;

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
    await userOnePage.goto("http://localhost:3000/");
    await userOnePage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userOnePage);
    await userOnePage.getByPlaceholder("Name").click();
    await userOnePage.getByPlaceholder("Name").fill("User 2");
    await userOnePage.getByRole("button", { name: "add contact Share invitation" }).click();
    await userOnePage.waitForTimeout(5000);
    await userOnePage.goBack();
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await userOnePage.waitForSelector(".ant-notification-notice");
    link = await userOnePage.evaluate("navigator.clipboard.readText()");
    await userOnePage.goto("http://localhost:3000/");
    await userOnePage.getByRole("button", { name: "Goals" }).click();
    await shareGoalPrivately(userOnePage);
  });

  test("add contact in user 2", async () => {
    await userTwoPage.goto(`${link}`);
    await userTwoPage.getByPlaceholder("Contact name").click();
    await userTwoPage.getByPlaceholder("Contact name").fill("User 1");
    await userTwoPage.getByRole("button", { name: "Add to my contacts" }).click();
  });

  test("share goal in user 1", async () => {
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await userOnePage.waitForSelector(".ant-notification-notice");
    await userOnePage.waitForTimeout(1000);
    await userOnePage.getByRole("button", { name: "U", exact: true }).click();
    await userOnePage.waitForTimeout(1000);
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
