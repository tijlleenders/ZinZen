import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";

export interface IDisplayChangesModal {
    parentId: string,
    typeAtPriority: typeOfChange | "none" | "conversionRequest",
    goals: GoalItem[]
  }
