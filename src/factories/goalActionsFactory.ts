import React from "react";
import { Action, IGoalActionsConfig } from "@src/types/goalActions.types";
import { unarchiveIcon } from "@src/assets";

export const createGoalActions = (config: IGoalActionsConfig): Action[] => {
  const { entityType, handlers, context } = config;

  const actionBuilders = {
    delete: (): Action => ({
      label: "Delete",
      icon: "Delete",
      onClick: handlers.onDelete!,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "delete",
    }),

    archive: (): Action => ({
      label: "Done",
      icon: "Correct",
      onClick: handlers.onArchive!,
      requiresConfirmation: true,
      confirmationCategory: context?.confirmActionCategory || "goal",
      confirmationAction: "archive",
    }),

    restore: (): Action => ({
      label: "Restore",
      icon: React.createElement("img", {
        alt: "restore goal",
        src: unarchiveIcon,
        width: 24,
        height: 25,
        style: { filter: context?.darkMode ? "invert(1)" : "none" },
      }),
      onClick: handlers.onRestore!,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "restore",
    }),

    edit: (): Action => ({
      label: "Edit",
      icon: "Edit",
      onClick: handlers.onEdit!,
    }),

    move: (): Action => ({
      label: "Move",
      icon: "Move",
      onClick: handlers.onMove!,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "move",
      dataTestId: "move-action",
    }),

    share: (): Action => ({
      label: "Share",
      icon: "SingleAvatar",
      onClick: handlers.onShare!,
      dataTestId: "share-action",
    }),

    report: (): Action => ({
      label: "Report",
      icon: React.createElement("img", {
        alt: "report hint",
        src: unarchiveIcon,
        width: 24,
        height: 25,
        style: { filter: context?.darkMode ? "invert(1)" : "none" },
      }),
      onClick: handlers.onReport!,
      loading: context?.isLoadingReport,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "reportHint",
    }),

    add: (): Action => ({
      label: "Add",
      icon: "Add",
      onClick: handlers.onAdd!,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "addHint",
    }),

    deleteHint: (): Action => ({
      label: "Delete",
      icon: "Delete",
      onClick: handlers.onDeleteHint!,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "deleteHint",
    }),
  };

  const actionMap: Record<string, Array<keyof typeof actionBuilders>> = {
    active: ["delete", "archive", "share", "edit", "move"],
    archived: ["restore", "delete"],
    deleted: ["restore", "delete"],
    hint: ["deleteHint", "add", "report"],
    "partner-active": ["edit"],
    "partner-archived": ["restore"],
  };

  const actionsToCreate = actionMap[entityType] || [];
  return actionsToCreate.map((actionKey) => actionBuilders[actionKey]());
};
