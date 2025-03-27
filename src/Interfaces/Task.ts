/* eslint-disable no-shadow */
import { CSSProperties } from "react";

export enum TaskStatusFromScheduler {
  TaskDone = 1,
}

export interface ITask {
  taskid: string;
  goalid: string;
  title: string;
  duration: number;
  start: string;
  deadline: string;
  goalColor: string;
  parentGoalId: string;
  status?: TaskStatusFromScheduler;
}

export interface ITaskOfDay {
  scheduled: ITask[];
  impossible: string[];
  freeHrsOfDay: number;
  scheduledHrs: number;
  colorBands: {
    goalId: string;
    duration: number;
    style: CSSProperties;
  }[];
}

// eslint-disable-next-line no-shadow
export enum TaskAction {
  NotNow = "Not now",
  Done = "Done",
  Focus = "Focus",
  Goal = "Goal",
  Skip = "Skip",
}
