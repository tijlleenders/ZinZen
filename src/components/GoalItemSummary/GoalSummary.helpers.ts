import i18next from "i18next";
import { useTranslation } from "react-i18next";

export const formatBudgetHrsToText = (min: number, max: number) => {
  if (min === 0 && max === 0) {
    return "";
  }

  if (min === max) {
    const translationKey = `hourWithCount_${min <= 1 ? "one" : "other"}`;
    return i18next.t(translationKey, { count: min });
  }

  const translationKey = `hourWithCount_${max <= 1 ? "one" : "other"}`;
  return `${min}-${i18next.t(translationKey, { count: max })}`;
};

// Utility function for singular/plural formatting
export const formatSingularPlural = (count: number, singularWord: string) => {
  return `${count} ${singularWord}${count !== 1 ? "s" : ""}`;
};

export const getDiffInDates = (date1: Date, date2: Date, resetTime = true) => {
  const a = new Date(date1);
  const b = new Date(date2);
  if (resetTime) {
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
  }
  // Convert both dates to milliseconds
  const date1MS = a.getTime();
  const date2MS = b.getTime();
  // Calculate the difference in milliseconds
  const differenceMS = date2MS - date1MS;
  // Convert the difference to days
  const daysDifference = Math.ceil(differenceMS / (1000 * 60 * 60 * 24));
  return daysDifference;
};

export const calculateDaysLeft = (dueDate: string) => {
  const { t } = useTranslation();
  if (!dueDate) return null;
  const currentDate = new Date();
  const due = new Date(dueDate);
  const daysLeft = getDiffInDates(currentDate, due);

  if (daysLeft === 0) {
    return t("dueToday");
  }
  if (daysLeft >= 0) {
    return daysLeft === 1 ? t("daysLeftSingular", { days: daysLeft }) : t("daysLeft", { days: daysLeft });
  }
  return daysLeft >= -1
    ? t("dueDatePassedSingular", { days: Math.abs(daysLeft) })
    : t("dueDatePassed", { days: Math.abs(daysLeft) });
};
