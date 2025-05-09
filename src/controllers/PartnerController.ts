import { GoalItem, IParticipant } from "@src/models/GoalItem";

import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";

import { createGoalObjectFromTags } from "../helpers/GoalProcessor";

const sendUpdate = (
  subscribers: IParticipant[],
  notificationGoalId: string,
  type: "subgoals" | "modifiedGoals",
  obj: {
    level: number;
    goal: GoalItem;
  }[],
) => {
  return subscribers.map(async (sub) =>
    sendUpdatesToSubscriber(sub, notificationGoalId, type, obj, "suggestion").then(() => console.log("update sent")),
  );
};

export const suggestNewGoal = async (newGoal: GoalItem, parentGoal: GoalItem, rootGoal: GoalItem, level: number) => {
  return sendUpdate(rootGoal.participants, rootGoal.id, "subgoals", [
    {
      level,
      goal: {
        ...inheritParentProps(
          {
            ...createGoalObjectFromTags({
              ...newGoal,
              language: getSelectedLanguage(),
            }),
            createdAt: `${new Date()}`,
          },
          parentGoal,
        ),
      },
    },
  ]);
};

export const suggestChanges = async (rootGoal: GoalItem, goalTags: GoalItem, level: number) => {
  const goal: GoalItem = {
    ...goalTags,
    newUpdates: false,
  };
  sendUpdate(rootGoal.participants, rootGoal.id, "modifiedGoals", [{ level, goal: { ...goal, participants: [] } }]);
};
