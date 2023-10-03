import { Page } from "@playwright/test";

export async function shareGoalPrivately(userOnePage: Page) {
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
