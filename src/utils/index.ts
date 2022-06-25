// @ts-nocheck
import { addGoal, createGoal } from "@src/api/GoalsAPI";

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

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export const createDummyGoals = async () => {
  console.log("wait");
  const dummyNames: string[] = ["Walk", "Gym", "Study", "Shopping", "Nap", "Code Reviews", "Algo Practice"];
  dummyNames.map(async (goalName: string) => {
    const dummyGoal = createGoal(
      goalName,
      true,
      random(1, 4),
      null,
      null,
      0,
      -1
    );
    const id = await addGoal(dummyGoal);
    return id;
  });
};
