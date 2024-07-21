import { test, expect } from "@playwright/test";
import { STORAGE_STATE } from "playwright/config/constants";

test.describe("Config Goal UI", () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");
  });

  test("should add a new goal after pressing Enter key", async ({ page }) => {
    await page.getByRole("button", { name: "Goals" }).click();
    await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
    await page.getByRole("button", { name: "Goal add goal", exact: true }).click();

    const titleInputContainer = page.getByPlaceholder("Goal title");
    const testGoalTitle = "Test Goal";
    await titleInputContainer.fill(testGoalTitle);
    await titleInputContainer.press("Enter");

    const myGoalContainer = page.locator(".myGoals-container");
    await expect(myGoalContainer).toContainText(testGoalTitle);
  });

  test("should add a new budget after pressing Enter key", async ({ page }) => {
    await page.getByRole("button", { name: "Goals" }).click();
    await page.getByRole("button", { name: "add goal | add feeling | add group", exact: true }).click();
    await page.getByRole("button", { name: "Budget add goal", exact: true }).click();

    const titleInputContainer = page.getByPlaceholder("Budget title");
    const testBudgetTitle = "Test Budget";
    await titleInputContainer.fill(testBudgetTitle);
    await titleInputContainer.press("Enter");

    const myGoalContainer = page.locator(".myGoals-container");
    await expect(myGoalContainer).toContainText(testBudgetTitle);
  });
});
