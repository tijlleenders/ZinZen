// @ts-nocheck

import { GoalItem } from "./GoalItem";

/* eslint-disable */
export default interface ContactItem {
    id: string;
    name: string;
    collaborativeGoals: { id: string, goal: GoalItem }[];
    sharedGoals: { id: string, goal: GoalItem }[];
    relId: string;
    accepted: boolean; 
    createdAt: Date;
};
