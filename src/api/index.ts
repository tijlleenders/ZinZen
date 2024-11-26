import { GoalItem } from "@src/models/GoalItem";
import { submitFeedback } from "./FeedbackAPI";
import { getGoal } from "./GoalsAPI";

export const reportHint = async (goal: GoalItem) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const parentGoal = await getGoal(goal.parentGoalId);
    const reportedHint = `Hint Reported: ${goal.title}\nParent Goal: ${parentGoal?.title}\nDuration: ${goal.duration}`;
    await submitFeedback(reportedHint);
    return {
      status: "success",
      message: "Hint reported",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Error reporting hint",
    };
  }
};
