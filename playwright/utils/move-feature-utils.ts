import { expect, Page } from "@playwright/test";

export const shareGoalFlow = async (page: Page, goalTitle: string, receiverName: string) => {
  await page.getByTestId(`goal-${goalTitle}`).getByTestId("goal-icon").locator("div").first().click();
  await page.getByTestId("share-action").click();

  await expect(async () => {
    await page.getByRole("button", { name: receiverName, exact: true }).click();
    await page.waitForSelector(".share-modal", { state: "hidden" });
    await page.waitForSelector(`text=Cheers!! Your goal and its subgoals are shared with ${receiverName}`);
    await page.goBack();
  }).toPass({
    timeout: 10_000,
  });
};
