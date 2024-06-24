import { IFeelingItem } from "@src/models";
import { TFeelingsObject } from "@src/models/FeelingItem";

const isToday = (date: string) => {
  return new Date(date).toDateString() === new Date().toDateString();
};

const isYesterday = (date: string) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(date).toDateString() === yesterday.toDateString();
};

const formatSubheaderDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getTitleForDate = (date: string) => {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return formatSubheaderDate(date);
};

export const groupFeelingsByDate = (feelings: IFeelingItem[]) => {
  return feelings.reduce<TFeelingsObject>((acc, feeling) => {
    const date = new Date(feeling.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(feeling);
    return acc;
  }, {});
};
