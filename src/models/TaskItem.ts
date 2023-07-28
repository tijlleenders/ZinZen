export interface TaskItem {
    id: string,
    goalId: string,
    title: string,
    hoursSpent: number,
    completedToday: number,
    forgotToday: string[],
    lastCompleted: string, // date
    lastForget: string // date
    blockedSlots: {
        start: string,
        end: string
    }[]
}
