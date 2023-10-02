import { test, expect } from "@playwright/test";

test("test", async ({ browser }) => {
  test.setTimeout(40000);
  const userOneContext = await browser.newContext({
    storageState: "./auth.json",
    serviceWorkers: "allow",
  });
  const userTwoContext = await browser.newContext({
    storageState: "./auth.json",
    serviceWorkers: "allow",
  });
  const userTwoPage = await userTwoContext.newPage();
  const userOnePage = await userOneContext.newPage();
  await userOnePage.goto("http://localhost:3000/");
  await userOnePage.getByRole("button", { name: "Goals" }).click();
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
  await userOnePage.getByPlaceholder("Name").click();
  await userOnePage.getByPlaceholder("Name").fill("User 2");
  await userOnePage.getByRole("button", { name: "add contact Share invitation" }).click();
  await userOnePage.waitForTimeout(5000);
  await userOnePage.goBack();
  await userOnePage.getByRole("button", { name: "U", exact: true }).click();
  await userOnePage.waitForSelector(".ant-notification-notice");
  const link = await userOnePage.evaluate("navigator.clipboard.readText()");
  await userOnePage.goto("http://localhost:3000/");
  await userOnePage.getByRole("button", { name: "Goals" }).click();
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

  await userTwoPage.waitForTimeout(1000);
  await userTwoPage.goto(`${link}`);
  await userTwoPage.getByPlaceholder("Contact name").click();
  await userTwoPage.getByPlaceholder("Contact name").fill("User 1");
  await userTwoPage.getByRole("button", { name: "Add to my contacts" }).click();
  await userTwoPage.waitForTimeout(2000);
  await userOnePage.getByRole("button", { name: "U", exact: true }).click();
  await userOnePage.waitForSelector(".ant-notification-notice");

  await userTwoPage.reload(); // Refresh the window
  await userTwoPage.getByRole("button", { name: "Goals" }).click();
  await userTwoPage.getByRole("button", { name: "Schedule" }).click();
  await userTwoPage.getByRole("button", { name: "Goals" }).click(); // Switch back to My Goals
  await userTwoPage.reload(); // Refresh the window
  await userTwoPage.waitForSelector(".header-icon[alt='zinzen inbox']");
  await userTwoPage.waitForSelector(".header-icon[alt='zinzen inbox']"); // Check if inbox icon is visible
  await userTwoPage.getByRole("button", { name: "zinzen inbox" }).click(); // Click on inbox
  await userTwoPage.waitForSelector(".goal-tile");
});
