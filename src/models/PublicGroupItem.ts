import { GoalItem } from "./GoalItem";

export interface IPollMetrics {
    upvotes: number,
    downvotes: number,
    happy: number,
    sad: number,
    inMygoals: number,
    completed: number
}

export interface IPoll {
    id: string,
    goal: GoalItem,
    metrics: IPollMetrics
}

export interface PublicGroupItem {
    id: string,
    title: string,
    polls: IPoll[],
    groupColor: string,
}
