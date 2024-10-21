import { addTaskDoneToday, deleteAllTasksDoneToday, getAllTasksDoneToday } from "@src/api/TasksDoneTodayAPI";

export const completeTask = async (
  scheduledTaskId: string,
  goalId: string,
  scheduledStart: string,
  scheduledEnd: string,
) => {
  try {
    await addTaskDoneToday({
      scheduledTaskId,
      goalId,
      scheduledStart,
      scheduledEnd,
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkAndCleanupDoneTodayCollection = async () => {
  const tasks = await getAllTasksDoneToday();

  if (tasks.length === 0) {
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
