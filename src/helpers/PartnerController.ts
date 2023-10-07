import { GoalItem } from "@src/models/GoalItem";
import { ISubscriber } from "@src/models/PubSubItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";

import { createGoalObjectFromTags } from "./GoalProcessor";

const extractSubs = (goal: GoalItem) => {
  const subscribers: ISubscriber[] = [];
  if (subscribers.length === 0 && goal.shared.contacts.length > 0) {
    subscribers.push({ subId: goal.shared.contacts[0].relId, type: "suggestion" });
  }
  return subscribers;
};

const sendUpdate = (
  subscribers: ISubscriber[],
  rootGoalId: string,
  type: "subgoals" | "modifiedGoals",
  obj: {
    level: number;
    goal: GoalItem;
  }[],
) => {
  return subscribers.map(async (sub) =>
    sendUpdatesToSubscriber(sub, rootGoalId, type, obj).then(() => console.log("update sent")),
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
  const subscribers = extractSubs(rootGoal);
  await Promise.all(sendUpdate(subscribers, rootGoal.id, "subgoals", [{ level, goal: newGoal }]));
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
  };
  const subscribers = extractSubs(rootGoal);
  sendUpdate(subscribers, rootGoal.id, "modifiedGoals", [{ level, goal }]);
};
