import { Action } from "@components/GoalActionsModal/GoalActionsModal";
import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";
import { actionBuilders } from "./actionBuilders";

export const createActiveGoalActions = (config: {
  goal: GoalItem;
  handlers: {
    onDelete: () => Promise<void> | void;
    onArchive: () => Promise<void> | void;
    onEdit: () => void;
    onMove: () => Promise<void> | void;
    onShare: () => void;
  };
  context?: {
    confirmActionCategory?: "goal" | "collaboration";
  };
}): Action[] => {
  const { handlers, context } = config;

  return [
    actionBuilders.delete(handlers.onDelete),
    actionBuilders.archive(handlers.onArchive, context?.confirmActionCategory),
    actionBuilders.share(handlers.onShare),
    actionBuilders.edit(handlers.onEdit),
    actionBuilders.move(handlers.onMove),
  ];
};

export const createArchivedGoalActions = (config: {
  goal: GoalItem;
  handlers: {
    onRestore: () => Promise<void> | void;
    onDelete: () => Promise<void> | void;
  };
  context?: {
    darkMode?: boolean;
  };
}): Action[] => {
  const { handlers, context } = config;

  return [actionBuilders.restore(handlers.onRestore, context?.darkMode), actionBuilders.delete(handlers.onDelete)];
};

export const createDeletedGoalActions = (config: {
  goal: TrashItem;
  handlers: {
    onRestore: () => Promise<void> | void;
    onDelete: () => Promise<void> | void;
  };
  context?: {
    darkMode?: boolean;
  };
}): Action[] => {
  const { handlers, context } = config;

  return [actionBuilders.restore(handlers.onRestore, context?.darkMode), actionBuilders.delete(handlers.onDelete)];
};

export const createHintGoalActions = (config: {
  goal: GoalItem;
  handlers: {
    onDeleteHint: () => Promise<void> | void;
    onAdd: () => Promise<void> | void;
    onReport: () => Promise<void> | void;
  };
  context?: {
    darkMode?: boolean;
    isLoadingReport?: boolean;
  };
}): Action[] => {
  const { handlers, context } = config;

  return [
    actionBuilders.deleteHint(handlers.onDeleteHint),
    actionBuilders.add(handlers.onAdd),
    actionBuilders.report(handlers.onReport, context?.darkMode, context?.isLoadingReport),
  ];
};

export const createPartnerActiveGoalActions = (config: {
  goal: GoalItem;
  handlers: {
    onEdit: () => void;
    onDelete: () => Promise<void> | void;
    onCollaborate: () => Promise<void> | void;
    onMove: () => Promise<void> | void;
  };
}): Action[] => {
  const { handlers } = config;

  return [
    actionBuilders.delete(handlers.onDelete),
    actionBuilders.collaborate(handlers.onCollaborate),
    actionBuilders.edit(handlers.onEdit),
    actionBuilders.move(handlers.onMove),
  ];
};

export const createPartnerArchivedGoalActions = (config: {
  goal: GoalItem;
  handlers: {
    onRestore: () => Promise<void> | void;
  };
  context?: {
    darkMode?: boolean;
  };
}): Action[] => {
  const { handlers, context } = config;

  return [actionBuilders.restore(handlers.onRestore, context?.darkMode)];
};
