import { Page } from "@playwright/test";

export async function shareGoalPrivately(userOnePage: Page) {
  await userOnePage.locator(".goal-dd-inner").first().click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^Share$/ })
    .first()
    .click();
  await userOnePage.getByRole("button", { name: "Share privately" }).click();
  await userOnePage.getByRole("button", { name: "Choose contact" }).click();
}
