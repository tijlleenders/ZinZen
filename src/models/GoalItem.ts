export type typeOfSub = "sharer" | "collaborator" | "assignee";

export interface IParticipant {
  relId: string;
  name: string;
  type: typeOfSub;
  following: boolean;
}

export type TGoalCategory = "Standard" | "Budget" | "Cluster";

export type TGoalTimeBudget = {
  perDay: string;
  perWeek: string;
};

export interface GoalItem {
  id: string;
  title: string;
  duration: string | null;
  sublist: string[];
  on: string[] | null;
  due: string | null;
  start: string | null;
  beforeTime: number | null;
  afterTime: number | null;
  createdAt: string;
  archived: "false" | "true";
  parentGoalId: string;
  goalColor: string;
  language: string;
  participants: IParticipant[];
  isShared: boolean;
  notificationGoalId: string;
  timeBudget?: TGoalTimeBudget;
  typeOfGoal: "myGoal" | "shared";
  category: TGoalCategory;
  newUpdates: boolean;
  timestamp: number;
}
