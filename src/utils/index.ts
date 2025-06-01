import { GoalItem } from "@src/models/GoalItem";
import { languagesFullForms } from "@src/translations/i18n";
import sha256 from "crypto-js/sha256";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";

export async function createContactRequest(url: string, body: object | null = null, method = "POST") {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {}),
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
}

export async function createGroupRequest(url: string, body: object | null = null, method = "POST") {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {}),
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
}

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

export const getLastDayDate = (dayIndex: number) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysUntilLastDay = (currentDay + 7 - dayIndex) % 7; // Offset to get to the specified day

  today.setDate(today.getDate() - daysUntilLastDay);
  return today;
};

export const getDiffInHours = (date1: Date, date2: Date) => {
  let diff = date1.getTime() - date2.getTime();
  diff = Math.round(Math.abs(diff / 36e5));
  return diff;
};

export const colorPalleteList = [
  "#A963B9",
  "#6B6EFF",
  "#4793E1",
  "#4CA46B",
  "#87FF2A",
  "#FFCC33",
  "#FF7A00",
  "#FC0909",
  "#FD5B78",
  "#FF007C",
];

export const fixDateVlauesInGoalObject = (goal: GoalItem) => ({
  ...goal,
  start: goal.start ? new Date(goal.start).toString() : null,
  due: goal.due ? new Date(goal.due).toString() : null,
});

export function inheritParentProps(newGoal: GoalItem, parentGoal: GoalItem) {
  const goal = { ...newGoal, participants: [] };

  if (!goal.due) {
    goal.due = parentGoal.due;
  }

  goal.notificationGoalId = parentGoal.notificationGoalId;
  goal.typeOfGoal = parentGoal.typeOfGoal;
  return goal;
}

export const convertNumberToHr = (hr: number) => `${hr > 9 ? "" : "0"}${hr} : 00`;

export function getInstallId() {
  return localStorage.getItem(LocalStorageKeys.INSTALL_ID);
}

export function getSelectedLanguage() {
  const langFromStorage = localStorage.getItem(LocalStorageKeys.LANGUAGE)?.slice(1, -1);
  const lang = langFromStorage ? languagesFullForms[langFromStorage] : languagesFullForms.en;
  return lang;
}

export function getDateInText(date: Date) {
  const dateInText = date.toLocaleDateString();
  const today = new Date();
  if (today.toLocaleDateString() === dateInText) {
    return "Today";
  }
  if (new Date(today.setDate(today.getDate() + 1)).toLocaleDateString() === dateInText) {
    return "Tomorrow";
  }
  return dateInText;
}

export function convertDateToString(date: Date, resetTime = true) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toTimeString();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}T${
    resetTime ? "00" : time.slice(0, 2)
  }:00:00`;
}

export function getOrdinalSuffix(dayOfMonth: number): string {
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
    return "st";
  }
  if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
    return "nd";
  }
  if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
    return "rd";
  }
  return "th";
}

// do not change the order
export const calDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function convertOnFilterToArray(on: "weekdays" | "weekends") {
  return on === "weekdays" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sat", "Sun"];
}

export const getMonthByIndex = (index: number) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return month[index];
};

export const formatTimeDisplay = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  return { minutes, seconds };
};

export const getSvgForGoalPps = (count: number) => {
  switch (count) {
    case 1:
      return "SingleAvatar";
    case 3:
      return "TwoAvatars";
    default:
      return "ThreeAvatars";
  }
};

export const hashObject = (obj: object) => {
  return sha256(JSON.stringify(obj)).toString();
};

export const arraysAreEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
};

export const checkOnArrayEquality = (arr1: string[], arr2: string[]): boolean => {
  const arr1Sorted = arr1.sort();
  const arr2Sorted = arr2.sort();
  return arraysAreEqual(arr1Sorted, arr2Sorted);
};

export const getTimePart = (datetime: string | null, part: "hour" | "minute" = "hour"): string | null => {
  return datetime ? datetime.split("T")[1]?.slice(part === "hour" ? 0 : 3, part === "hour" ? 2 : 5) : null;
};
