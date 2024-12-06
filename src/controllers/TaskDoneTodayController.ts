import { addTaskDoneToday, deleteAllTasksDoneToday, getAllTasksDoneToday } from "@src/api/TasksDoneTodayAPI";

export const completeTask = async (
  scheduledTaskId: string,
  goalId: string,
  scheduledStart: string,
  scheduledEnd: string,
) => {
  await addTaskDoneToday({
    scheduledTaskId,
    goalId,
    scheduledStart,
    scheduledEnd,
  });
};

export const checkAndCleanupDoneTodayCollection = async () => {
  const tasks = await getAllTasksDoneToday();

  if (!tasks.length) {
    return;
  }

  const firstTaskScheduledStart = new Date(tasks[0].scheduledStart);
  const today = new Date();
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  if (!isSameDay(firstTaskScheduledStart, today)) {
    await deleteAllTasksDoneToday();
  }
};
