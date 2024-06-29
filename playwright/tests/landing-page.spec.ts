import { test, expect, Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Onboarding", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test("should select a language and navigate to the FAQ page", async () => {
    await page.goto("http://127.0.0.1:3000/");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3000/ZinZenFAQ");
  });

  test("should navigate to the homepage after clicking continue button on the FAQ page", async () => {
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3000/");
  });
});
