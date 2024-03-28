import { GoalItem, IParticipant } from "@src/models/GoalItem";

import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";

import { createGoalObjectFromTags } from "./GoalProcessor";

const sendUpdate = (
  subscribers: IParticipant[],
  rootGoalId: string,
  type: "subgoals" | "modifiedGoals",
  obj: {
    level: number;
    goal: GoalItem;
  }[],
) => {
  return subscribers.map(async (sub) =>
    sendUpdatesToSubscriber(sub, rootGoalId, type, obj, "suggestion").then(() => console.log("update sent")),
  );
};

export const suggestNewGoal = async (
  rootGoal: GoalItem,
  parentGoal: GoalItem,
  goalTags: GoalItem,
  goalTitle: string,
  goalColor: string,
  level: number,
) => {
  let newGoal = createGoalObjectFromTags({
    ...goalTags,
    title: goalTitle
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    language: getSelectedLanguage(),
    parentGoalId: parentGoal.id,
    goalColor,
  });
  newGoal.createdAt = `${new Date()}`;
  newGoal = inheritParentProps(newGoal, parentGoal);
  await Promise.all(sendUpdate(rootGoal.participants, rootGoal.id, "subgoals", [{ level, goal: newGoal }]));
};

export const suggestChanges = async (
  rootGoal: GoalItem,
  goalTags: GoalItem,
  goalTitle: string,
  goalColor: string,
  level: number,
) => {
  const goal: GoalItem = {
    ...goalTags,
    title: goalTitle
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor,
    newUpdates: false,
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { participants, ...changes } = goal;
  sendUpdate(rootGoal.participants, rootGoal.id, "modifiedGoals", [{ level, goal: changes }]);
};
