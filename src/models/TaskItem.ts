export interface blockedSlotOfTask {
    start: string,
    end: string
}

export interface TaskItem {
    id: string,
    goalId: string,
    title: string,
    hoursSpent: number,
    completedToday: number,
    forgotToday: string[],
    lastCompleted: string, // date
    lastForget: string // date
    blockedSlots: blockedSlotOfTask[]
}
