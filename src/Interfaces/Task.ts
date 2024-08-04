import { CSSProperties } from "react";

export interface ITask {
  taskid: string;
  goalid: string;
  title: string;
  duration: number;
  start: string;
  deadline: string;
  goalColor: string;
  parentGoalId: string;
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
  Skip = "Skip",
  Reschedule = "Reschedule",
  Done = "Done",
  Focus = "Focus",
  Goal = "Goal",
}
