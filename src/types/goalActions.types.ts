import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";
import { Action } from "@components/GoalActionsModal/GoalActionsModal";

export type GoalEntityType = "active" | "archived" | "deleted" | "hint" | "partner-active" | "partner-archived";

export interface IGoalActionHandlers {
  onDelete?: () => Promise<void> | void;
  onArchive?: () => Promise<void> | void;
  onRestore?: () => Promise<void> | void;
  onEdit?: () => void;
  onMove?: () => Promise<void> | void;
  onShare?: () => void;
  onReport?: () => Promise<void> | void;
  onAdd?: () => Promise<void> | void;
  onDeleteHint?: () => Promise<void> | void;
}

export interface IGoalActionsConfig {
  goal: GoalItem | TrashItem;
  entityType: GoalEntityType;
  handlers: IGoalActionHandlers;
  context?: {
    darkMode?: boolean;
    isLoadingReport?: boolean;
    confirmActionCategory?: "goal" | "collaboration";
  };
}

export type { Action };
