export type typeOfSub = "sharer" | "collaborator" | "assignee";

export interface IParticipant {
  relId: string;
  name: string;
  type: typeOfSub;
  following: boolean;
}

export type TGoalCategory = "Standard" | "Budget" | "Cluster";

export type TGoalTimeBudget = {
  perDay: {
    min: number;
    max: number;
  };
  perWeek: {
    min: number;
    max: number;
  };
};

export interface GoalItem {
  id: string;
  title: string;
  duration: string | undefined;
  sublist: string[];
  on: string[] | undefined;
  due: string | undefined;
  start: string | undefined;
  beforeTime: number | undefined;
  afterTime: number | undefined;
  createdAt: string;
  archived: "false" | "true";
  parentGoalId: string;
  goalColor: string;
  language: string;
  participants: IParticipant[];
  isShared: boolean;
  notificationGoalId: string;
  timeBudget: TGoalTimeBudget | undefined;
  typeOfGoal: "myGoal" | "shared";
  category: TGoalCategory;
  newUpdates: boolean;
  timestamp: number;
}
