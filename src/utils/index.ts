import { GoalItem } from "@src/models/GoalItem";
import { languagesFullForms } from "@src/translations/i18n";

export async function createContactRequest(url: string, body : object | null = null, method = "POST") {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {})
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
}

export async function createGroupRequest(url: string, body : object | null = null, method = "POST") {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {})
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
}

export const myNameSpace = "c95256dc-aa03-11ed-afa1-0242ac120002";

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

export const colorPalleteList = [
  "#A963B9", "#6B6EFF", "#4793E1",
  "#4CA46B", "#87FF2A", "#FFFF66",
  "#FFCC33", "#FF7A00", "#FC0909",
  "#FD5B78", "#FF007C"
];

export const fixDateVlauesInGoalObject = (goal: GoalItem) => ({ ...goal,
  start: goal.start ? new Date(goal.start) : null,
  due: goal.due ? new Date(goal.due) : null
});

export function inheritParentProps(newGoal: GoalItem, parentGoal: GoalItem) {
  const goal = { ...newGoal };
  if (!goal.start) { goal.start = parentGoal.start; }
  if (!goal.due) { goal.due = parentGoal.due; }
  if (!(goal.beforeTime || goal.beforeTime === 0)) { goal.beforeTime = parentGoal.beforeTime; }
  if (!(goal.afterTime || goal.afterTime === 0)) { goal.afterTime = parentGoal.afterTime; }
  if (!goal.on) { goal.on = parentGoal.on; }
  if (!goal.habit) { goal.habit = parentGoal.habit; }
  if (!goal.timeBudget) { goal.timeBudget = parentGoal.timeBudget; }
  if (!goal.on) { goal.on = parentGoal.on; }

  goal.rootGoalId = parentGoal.rootGoalId;
  goal.typeOfGoal = parentGoal.typeOfGoal;
  return goal;
}

export const convertNumberToHr = (hr: number) => `${hr > 9 ? "" : "0"}${hr} : 00`;

export function getInstallId() { return localStorage.getItem("installId"); }

export function getSelectedLanguage() {
  const langFromStorage = localStorage.getItem("language")?.slice(1, -1);
  const lang = langFromStorage ? languagesFullForms[langFromStorage] : languagesFullForms.en;
  return lang;
}

export function getDateInText(date: Date) {
  const dateInText = date.toLocaleDateString();
  const today = new Date();
  if (today.toLocaleDateString() === dateInText) { return "Today"; }
  if (new Date(today.setDate(today.getDate() + 1)).toLocaleDateString() === dateInText) {
    return "Tomorrow";
  }
  return dateInText;
}

export function getOrdinalSuffix(dayOfMonth: number): string {
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
    return "st";
  } if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
    return "nd";
  } if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
    return "rd";
  }
  return "th";
}

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function convertOnFilterToArray(on: "weekdays" | "weekends") {
  return on === "weekdays" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sat", "Sun"];
}

export const getMonthByIndex = (index: number) => {
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return month[index];
};
