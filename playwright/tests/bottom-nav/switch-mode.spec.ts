import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE } from "playwright/config/constants";

test.describe("Switch Mode", () => {
  test.use({ storageState: STORAGE_STATE });

  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000/");
  });

  test("should toggle dark mode when Switch Mode button is clicked", async () => {
    await page.getByRole("img", { name: "Settings" }).click();
    await page.getByRole("menuitem", { name: "Change theme" }).click();
    await page.getByRole("button", { name: "Switch Mode" }).click();

    await expect(page.locator(".App-light")).toBeVisible();
    await expect(page.locator(".App-dark")).not.toBeVisible();

    await page.getByRole("button", { name: "Switch Mode" }).click();
    await expect(page.locator(".App-light")).not.toBeVisible();
    await expect(page.locator(".App-dark")).toBeVisible();
    await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
  });

  test("should change to next theme when Next button is clicked", async () => {
    await page.getByRole("img", { name: "Settings" }).click();
    await page.getByRole("menuitem", { name: "Change theme" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.locator(".dark-theme1")).not.toBeVisible();
    await expect(page.locator(".dark-theme2")).toBeVisible();
    await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
  });

  test("should change back to previous theme when Prev button is clicked", async () => {
    await page.getByRole("img", { name: "Settings" }).click();
    await page.getByRole("menuitem", { name: "Change theme" }).click();
    await page.getByRole("button", { name: "Prev" }).click();
    await expect(page.locator(".dark-theme2")).not.toBeVisible();
    await expect(page.locator(".dark-theme1")).toBeVisible();
    await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
  });
});
