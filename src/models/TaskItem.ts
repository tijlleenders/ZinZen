export interface TaskItem {
    id: string,
    goalId: string,
    title: string,
    hoursSpent: number,
    currentStatus: { date: string, count: number } | null,
    lastCompleted: { taskIds: string[], date: string }, // date
    lastForget: { taskIds: string[], date: string }, // date
}
