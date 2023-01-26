import { ITask } from "@src/Interfaces/Task";

// Returns tasks whose start day is a specified number of days after today
// For tasks starting today, pass 'daysAfterToday' = 0
export const TaskFilter = (tasks: ITask[], daysAfterToday: number): ITask[] => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysAfterToday);
  return tasks.filter((task) => {
    const taskDate = new Date(`${task.start}Z`); // 'Z' needed to specify UTC
    return taskDate.toDateString() === targetDate.toDateString();
  });
};
