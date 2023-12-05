export type typeOfSub = "sharer" | "collaborator" | "assignee";

export interface IParticipant {
  relId: string;
  name: string;
  type: typeOfSub;
  following: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  duration: string | null;
  sublist: string[];
  habit: string | null;
  on: string[];
  due: string | null;
  start: string | null;
  beforeTime: number | null;
  afterTime: number | null;
  createdAt: string;
  softDeletedAt: string | null;
  archived: "false" | "true";
  parentGoalId: string;
  goalColor: string;
  language: string;
  link: string | null;
  participants: IParticipant[];
  rootGoalId: string;
  timeBudget: {
    perDay: string | null;
    perWeek: string | null;
  };
  typeOfGoal: "myGoal" | "shared";
  newUpdates: boolean;
}
