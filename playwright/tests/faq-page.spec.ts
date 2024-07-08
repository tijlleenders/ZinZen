import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE } from "playwright/config/constants";

test.use({ storageState: STORAGE_STATE });

test.describe("Faq Page", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000/ZinZenFAQ");
  });

  test("should show 4 questions", async () => {
    await expect(page.locator(".ant-collapse-item")).toHaveCount(4);
    await expect(page.getByText("What is ZinZen"))
      .toBeVisible()
      .then(() => expect(page.getByText("Is it private")).toBeVisible())
      .then(() => expect(page.getByText("Is it expensive")).toBeVisible())
      .then(() => expect(page.getByText("Too good to be true?")).toBeVisible());
  });

  test("should collapse and uncollapse Faq accordion panels", async () => {
    await page.locator(".ant-collapse-header").first().click();
    await expect(page.locator(".ant-collapse-item").first()).not.toHaveClass(
      "ant-collapse-item ant-collapse-item-active",
    );
    await page.locator(".ant-collapse-header").first().click();
    await expect(page.locator(".ant-collapse-item").first()).toHaveClass("ant-collapse-item ant-collapse-item-active");
  });
});
