import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { GoalItem } from "@src/models/GoalItem";

// @ts-nocheck
export const formatDate = () => {
  const newDate = new Date();
  return newDate;
};

export const getJustDate = (fullDate: Date) => new Date(fullDate.toDateString());

export const truncateContent = (content: string, maxLength = 20) => {
  const { length } = content;
  if (length >= maxLength) {
    return `${content.substring(0, maxLength)}...`;
  }
  return content;
};

export const getDates = (startDate: Date, stopDate: Date) => {
  const dateArray = [];
  const currentDate: Date = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

export const getDiffInHours = (date1 : Date, date2: Date) => {
  let diff = date1.getTime() - date2.getTime();
  diff = Math.round(Math.abs(diff / 36e5));
  return diff;
};

export const colorPallete = [
  "#A963B9", "#6B6EFF", "#4793E1",
  "#4CA46B", "#87FF2A", "#FFFF66",
  "#FFCC33", "#FF7A00", "#FC0909",
  "#FD5B78", "#FF007C"
];

export function getDefaultValueOfCollab() {
  const value: ICollaboration = {
    status: "none",
    newUpdates: false,
    relId: "",
    name: "",
    rootGoal: "root",
    allowed: true,
    notificationCounter: 0,
  };
  return value;
}

export function inheritParentProps(newGoal: GoalItem, parentGoal: GoalItem) {
  const goal = { ...newGoal };
  if (!goal.start) { goal.start = parentGoal.start; }
  if (!goal.due) { goal.due = parentGoal.due; }
  if (!goal.beforeTime) { goal.beforeTime = parentGoal.beforeTime; }
  if (!goal.afterTime) { goal.afterTime = parentGoal.afterTime; }
  return goal;
}
