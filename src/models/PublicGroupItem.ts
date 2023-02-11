import { GoalItem } from "./GoalItem";

export interface IPollMetrics {
    upvotes: number,
    downvotes: number,
    inMygoals: number,
    completed: number
}

export interface IMyMetrics {
    voteScore: number,
    inMyGoals: boolean,
    completed: boolean,
}

export interface IPoll {
    id: string,
    goal: GoalItem,
    metrics: IPollMetrics
    myMetrics: IMyMetrics
    createdAt: string,
}

export interface PublicGroupItem {
    id: string,
    title: string,
    polls: IPoll[],
    language: string
    groupColor: string,
    createdAt: string
}
