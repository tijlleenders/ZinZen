export interface ISchedulerInputGoal{
    id: string;
    title: string;
    duration: string;
    start: string;
    deadline: string;
}

export interface IMSInputGoal {
    after_time: number | undefined,
    before_time: number | undefined,
    children: string[],
    duration: number,
    id: string,
    start: string | undefined,
    deadline: string | undefined,
    repeat: string,
    title: string
}

export interface I24Slots {
    bookedBy: string;
    booked: boolean;
}

export interface schedulerSlot {
    start: number,
    deadline: number,
    duration: number,
    goalid: string,
    title: string }
