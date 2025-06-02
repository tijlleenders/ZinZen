import { GoalItem } from "@src/models/GoalItem";

export const roundOffHours = (hrsValue: string) => {
  return hrsValue === "" ? "" : String(Math.min(Math.max(Math.round(Number(hrsValue)), 0), 99));
};

// do not change the order
export const calDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function convertOnFilterToArray(on: "weekdays" | "weekends") {
  return on === "weekdays" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sat", "Sun"];
}

export const getDefaultColorIndex = (
  isEditMode: boolean,
  goal: GoalItem,
  parentGoal: GoalItem | undefined,
  colorPalleteList: string[],
): number => {
  if (isEditMode) {
    return colorPalleteList.indexOf(goal.goalColor);
  }

  if (parentGoal) {
    return colorPalleteList.indexOf(parentGoal.goalColor);
  }

  return Math.floor(Math.random() * colorPalleteList.length - 1) + 1;
};
