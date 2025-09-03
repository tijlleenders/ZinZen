import { Page } from "@playwright/test";
import { API_SERVER_URL_GOAL_SHARING } from "../config/constants";

export const shareGoalFlow = async (
  page: Page,
  goalTitle: string,
  receiverName: string,
  maxRetries = 3,
  retryDelay = 1000,
) => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await page.getByTestId(`goal-${goalTitle}`).getByTestId("goal-icon").locator("div").first().click();
      await page.getByTestId("share-action").click();

      await page.getByRole("button", { name: receiverName, exact: true }).click();

      await page.waitForResponse(
        async (res) => {
          if (res.url().includes(API_SERVER_URL_GOAL_SHARING) && res.status() === 200) {
            try {
              const responseBody = await res.json();
              return responseBody.message === "OK";
            } catch (error) {
              return false;
            }
          }
          return false;
        },
        { timeout: 30000 },
      );

      console.log("Share request successful:", {
        goalTitle,
        receiverName,
      });
      await page.goBack();
      return;
    } catch (error) {
      attempts++;
      console.error(`Share attempt ${attempts} failed:`, {
        error: error.message,
        goalTitle,
        receiverName,
      });

      if (attempts === maxRetries) {
        throw new Error(
          `Failed to share goal "${goalTitle}" with "${receiverName}" after ${maxRetries} attempts. ` +
            `Last error: ${error.message}`,
        );
      }

      console.log(`Retrying in ${retryDelay}ms...`);
      await page.waitForTimeout(retryDelay);
      await page.goBack();
    }
  }
};
