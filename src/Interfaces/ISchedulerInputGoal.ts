export interface ISchedulerOutputSlot {
    goalid: string,
    start: number,
    deadline: number,
    duration: number,
    title: string
}

export interface IFinalOutputSlot {
    goalid: string,
    start: string,
    deadline: string,
    duration: number,
    title: string
}

export interface ISchedulerOutput {
    scheduled: { day: string, outputs: IFinalOutputSlot[] }[],
    impossible: { day: string, outputs: IFinalOutputSlot[] }[],
}

export interface ISchedulerInputGoal {
    id: string,
    title: string
    min_duration: number,
    start?: string,
    deadline?: string,
    filters?: {
        after_time: number,
        before_time: number,
        on_days: string[],
        not_on: string[],
    },
    repeat?: string,
    budgets: { budget_type: "Daily" | "Weekly", min: number }[]
    children: string[],
    createdAt: string,
    hoursSpent: number,
    skippedToday: string[]
}

export type TBufferValue = { nextBuffer: number, availableBuffer: number }[]
