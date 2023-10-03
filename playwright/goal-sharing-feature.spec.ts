import { test, expect, Page } from "@playwright/test";

async function shareGoalPrivately(userOnePage: Page) {
  await userOnePage.locator(".goal-tile").first().click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^ActionsEdit$/ })
    .locator("div")
    .nth(2)
    .click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^Share$/ })
    .first()
    .click();
  await userOnePage.getByRole("button", { name: "Share privately" }).click();
  await userOnePage.getByRole("button", { name: "Choose contact" }).click();
}

test("test", async ({ browser }) => {
  test.setTimeout(40000);
  const userOneContext = await browser.newContext({
    storageState: "playwright/userOnboarding.json",
  });
  const userTwoContext = await browser.newContext({
    storageState: "playwright/userOnboarding.json",
  });

  const userTwoPage = await userTwoContext.newPage();
  const userOnePage = await userOneContext.newPage();

  await userOnePage.goto("http://localhost:3000/");
  await userOnePage.getByRole("button", { name: "Goals" }).click();
  await shareGoalPrivately(userOnePage);
  await userOnePage.getByPlaceholder("Name").click();
  await userOnePage.getByPlaceholder("Name").fill("User 2");
  await userOnePage.getByRole("button", { name: "add contact Share invitation" }).click();
  await userOnePage.waitForTimeout(3000);
  await userOnePage.goBack();
  await userOnePage.getByRole("button", { name: "U", exact: true }).click();
  await userOnePage.waitForSelector(".ant-notification-notice");
  const link = await userOnePage.evaluate("navigator.clipboard.readText()");
  await userOnePage.goto("http://localhost:3000/");
  await userOnePage.getByRole("button", { name: "Goals" }).click();
  await shareGoalPrivately(userOnePage);

  await userTwoPage.goto(`${link}`);
  await userTwoPage.getByPlaceholder("Contact name").click();
  await userTwoPage.getByPlaceholder("Contact name").fill("User 1");
  await userTwoPage.getByRole("button", { name: "Add to my contacts" }).click();

  await userOnePage.getByRole("button", { name: "U", exact: true }).click();
  await userOnePage.waitForSelector(".ant-notification-notice");
  await userOnePage.goto("http://localhost:3000/");
  await userOnePage.getByRole("button", { name: "Goals" }).click();
  await userOnePage.locator("div:nth-child(2) > .user-goal > .user-goal-main > .goal-tile").click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^ActionsEdit$/ })
    .locator("div")
    .nth(2)
    .click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^Share$/ })
    .first()
    .click();
  await userOnePage.getByRole("button", { name: "Share privately" }).click();
  await userOnePage.getByRole("button", { name: "Choose contact" }).click();
  await userOnePage.locator("#modal-contact-list").getByRole("button", { name: "U" }).click();
  await userOnePage.waitForSelector(".ant-notification-notice");
  await userTwoPage.getByRole("button", { name: "Schedule" }).click();
  await userTwoPage.reload(); // Refresh the window
  await userTwoPage.waitForTimeout(3000);
  await userTwoPage.getByRole("button", { name: "Goals" }).click();
  await userTwoPage.getByRole("img", { name: "zinzen inbox" }).click();

  await expect(userTwoPage.locator(".user-goal-main")).toBeVisible();
});
