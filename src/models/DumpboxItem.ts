import { GoalItem } from "./GoalItem";

export interface DumpboxItem {
    id?: number,
    relId: string,
    goalId: string,
    subgoals: GoalItem[],
    updatedGoals: GoalItem[],
    deletedGoals: GoalItem[],
}
