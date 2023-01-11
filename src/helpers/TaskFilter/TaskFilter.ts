import { TaskItem } from "@src/models/TaskItem";

// Returns tasks whose start day is a specified number of days after today
// For tasks starting today, pass 'daysAfterToday' = 0
export const TaskFilter = (tasks: TaskItem[], daysAfterToday: number): TaskItem[] => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysAfterToday);
  return tasks.filter((task) => {
    const taskDate = new Date(`${task.start}`);
    return taskDate.toDateString() === targetDate.toDateString();
  });
};
