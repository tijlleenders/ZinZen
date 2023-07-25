export const createImpossibleSlot = (task: ISchedulerOutputSlot, tmpStartDate: Date, selectedDay: number, start: number, end: number) => {
  const predictedDeadline = start + task.duration;
  const actualDeadline = task.deadline < predictedDeadline && task.deadline < end ?
    task.deadline : predictedDeadline > end ?
      end > task.deadline ? task.deadline : end
      : predictedDeadline;

  return {
    ...task,
    start: formatDate(tmpStartDate.getDate() + selectedDay - 1, start),
    deadline: formatDate(tmpStartDate.getDate() + selectedDay - 1, actualDeadline),
    duration: actualDeadline - start,
  };
};
