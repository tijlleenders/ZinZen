// @ts-nocheck

import { GoalItem } from "./GoalItem";

/* eslint-disable */
export default interface ContactItem {
    name: string;
    goals: { id: string, goal: GoalItem }[],
    relId: string;
    createdAt: Date;
};
