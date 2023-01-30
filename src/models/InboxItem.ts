import { GoalItem } from "./GoalItem";

export type typeOfChange = "subgoals" | "modifiedGoals" | "archived" | "deleted"

export interface IChangesInGoal {
    subgoals: { level: number, goal: GoalItem }[],
    modifiedGoals: { level: number, goal: GoalItem }[],
    archived: { level: number, id: string }[],
    deleted: { level: number, id: string }[]
}

export interface InboxItem {
    id: string,
    goalChanges: IChangesInGoal
}
