import { GoalItem } from "./GoalItem";

export interface OutboxItem {
    id?: number,
    relId: string,
    goalId: string,
    subgoals: GoalItem[],
    updatedGoals: GoalItem[],
    deletedGoals: GoalItem[],
}
