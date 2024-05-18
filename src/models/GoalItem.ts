export type typeOfSub = "sharer" | "collaborator" | "assignee";

export interface IParticipant {
  relId: string;
  name: string;
  type: typeOfSub;
  following: boolean;
}

export type TGoalCategory = "Standard" | "Budget" | "Cluster";

export interface GoalItem {
  id: string;
  title: string;
  duration: string | null;
  sublist: string[];
  habit: string | null;
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
  link: string | null;
  participants: IParticipant[];
  rootGoalId: string;
  timeBudget:
    | {
        perDay: string;
        perWeek: string;
      }
    | undefined;
  typeOfGoal: "myGoal" | "shared";
  category: TGoalCategory;
  newUpdates: boolean;
}
