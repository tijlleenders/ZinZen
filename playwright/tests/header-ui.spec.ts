import { test, expect } from "@playwright/test";
import { STORAGE_STATE } from "playwright/config/constants";

test.describe("Header component", () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");
  });

  test("should display the title correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Goals" }).click();
    const heading = page.getByRole("heading");
    await expect(heading).toHaveText("My goals");
  });

  test("should show search input when search icon is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Goals" }).click();
    const searchIcon = page.getByRole("img", { name: "zinzen search" });
    await searchIcon.click();
    const searchInput = page.getByPlaceholder("Search");
    await expect(searchInput).toBeVisible();
  });

  test("should open settings dropdown when settings icon is clicked", async ({ page }) => {
    const settingsIcon = page.getByRole("img", { name: "Settings" });
    await settingsIcon.click();
    const settingsDropdown = page.locator(".ant-dropdown");
    await expect(settingsDropdown).toHaveCSS("display", "block");
  });

  test("should close settings dropdown when clicked outside", async ({ page }) => {
    const settingsIcon = page.getByRole("img", { name: "Settings" });
    await settingsIcon.click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });
    const settingsDropdown = page.locator(".ant-dropdown");
    await expect(settingsDropdown).toHaveCSS("display", "none");
  });

  test("should toggle dark mode when Switch Mode button is clicked", async ({ page }) => {
    const settingsIcon = page.getByRole("img", { name: "Settings" });
    await settingsIcon.click();

    const darkModeSwitch = page.locator("div").filter({ hasText: /^Dark mode$/ });
    await darkModeSwitch.click();
    await expect(page.locator(".App-light")).toBeVisible();
    await expect(page.locator(".App-dark")).not.toBeVisible();

    await settingsIcon.click();
    await darkModeSwitch.click();
    await expect(page.locator(".App-light")).not.toBeVisible();
    await expect(page.locator(".App-dark")).toBeVisible();
  });

  test("verify header icons visibility on specific pages", async ({ page }) => {
    const checkHeaderItems = async () => {
      const settingsIcon = page.getByRole("img", { name: "Settings" });
      const lightModeIcon = page.getByRole("img", { name: "light mode" });
      const searchIcon = page.getByRole("img", { name: "zinzen search" });

      await expect(settingsIcon).toBeVisible();
      await expect(lightModeIcon).toBeVisible();
      await expect(searchIcon).not.toBeVisible();
    };

    await page.getByRole("button", { name: "Journal" }).click();
    await checkHeaderItems();

    await page.getByRole("button", { name: "Schedule" }).click();
    await checkHeaderItems();
  });
});
