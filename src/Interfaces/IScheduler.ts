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

export interface IImpossibleTaskOfTheDay {
  id: string;
  hoursMissing: number;
  periodStartDateTime: string;
  periodEndDateTime: string;
}

export interface ISchedulerOutput {
  scheduled: IScheduleOfTheDay[];
  impossible: IImpossibleTaskOfTheDay[];
}

export type TaskTimeSlot = {
  scheduledStartDateTime: string;
  duration: number;
};

export interface IGoalCompletedStats {
  totalDurationCompleted?: number;
  tasksCompletedSinceMonday?: TaskTimeSlot[];
  tasksSkippedSinceMonday?: TaskTimeSlot[];
}

export interface ISchedulerInputGoal {
  id: string;
  title: string;
  minDuration?: number;
  start?: string;
  deadline?: string;
  filters?: {
    afterTime?: number;
    beforeTime?: number;
    onDays?: string[];
  };
  notOn?: blockedSlotOfTask[];
  repeat?: string;
  budget?: {
    minPerDay?: number;
    maxPerDay?: number;
    minPerWeek?: number;
    maxPerWeek?: number;
  };
  children?: string[];
  createdAt: string;
  stats?: IGoalCompletedStats;
}

export interface ISchedulerOutputGoal {
  goalid: string;
  start: string;
  deadline: string;
  duration: number;
  title: string;
  taskid: string;
}

export interface ISchedulerInput {
  startDate: string;
  endDate: string;
  goals: ISchedulerInputGoal[];
}

export type TBufferValue = { nextBuffer: number; availableBuffer: number };

export type SchedulerCacheCode = "not-exist" | "expired" | "found";
