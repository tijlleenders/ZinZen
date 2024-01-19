import { Page } from "@playwright/test";

export async function shareGoalPrivately(userOnePage: Page) {
  await userOnePage.locator(".goal-dd-inner").first().click();
  await userOnePage
    .locator("div")
    .filter({ hasText: /^Share$/ })
    .first()
    .click();
}
