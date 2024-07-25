import { test, expect } from "@playwright/test";
import { STORAGE_STATE } from "playwright/config/constants";

test.describe("BottomNavbar", () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");
  });

  test("should navigate to MyTime when Schedule button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Schedule" }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3000/");
  });

  test("should navigate to MyGoals when Goals button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Goals" }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3000/goals");
  });

  test("should navigate to MyJournal when Journal button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Journal" }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3000/MyJournal");
  });
});
