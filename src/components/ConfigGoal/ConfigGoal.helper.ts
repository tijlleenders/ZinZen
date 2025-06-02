import { GoalItem } from "@src/models/GoalItem";
import { getRandomColor } from "@src/utils";

export const roundOffHours = (hrsValue: string) => {
  return hrsValue === "" ? "" : String(Math.min(Math.max(Math.round(Number(hrsValue)), 0), 99));
};

// do not change the order
export const calDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function convertOnFilterToArray(on: "weekdays" | "weekends") {
  return on === "weekdays" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sat", "Sun"];
}

export const getDefaultColor = (
  isEditMode: boolean,
  goal: GoalItem,
  parentGoal: GoalItem | undefined,
  colorPalleteList: string[],
): string => {
  if (isEditMode) {
    return goal.goalColor;
  }

  if (parentGoal) {
    return parentGoal.goalColor;
  }

  return getRandomColor(colorPalleteList);
};
