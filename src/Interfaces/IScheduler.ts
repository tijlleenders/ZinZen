import { blockedSlotOfTask } from "@src/models/TaskItem";

export interface ISchedulerOutputSlot {
  goalid: string;
  start: number;
  deadline: number;
  duration: number;
  title: string;
}

export interface IFinalOutputSlot {
  goalid: string;
  start: string;
  deadline: string;
  duration: number;
  title: string;
}

export interface IScheduleOfTheDay {
  day: string;
  tasks: IFinalOutputSlot[];
}

export interface ISchedulerOutput {
  scheduled: IScheduleOfTheDay[];
  impossible: IScheduleOfTheDay[];
}

export interface ISchedulerInputGoal {
  id: string;
  title: string;
  min_duration?: number;
  start?: string;
  deadline?: string;
  filters?: {
    afterTime?: number;
    beforeTime?: number;
    onDays?: string[];
    notOn?: blockedSlotOfTask[];
  };
  repeat?: string;
  budget?: {
    minPerDay?: number;
    maxPerDay?: number;
    minPerWeek?: number;
    maxPerWeek?: number;
  };
  children?: string[];
  createdAt: string;
  hoursSpent?: number;
  skippedToday?: string[];
}

export interface ISchedulerOutputGoal {
  goalid: string;
  start: string;
  deadline: string;
  duration: number;
  title: string;
  taskid: string;
}

export type TBufferValue = { nextBuffer: number; availableBuffer: number };
