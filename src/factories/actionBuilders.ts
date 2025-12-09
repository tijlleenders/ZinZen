import React from "react";
import { Action } from "@components/GoalActionsModal/GoalActionsModal";
import { unarchiveIcon } from "@src/assets";

export type ActionTestId =
  | "delete-action"
  | "archive-action"
  | "restore-action"
  | "edit-action"
  | "move-action"
  | "share-action"
  | "report-hint-action"
  | "add-hint-action"
  | "delete-hint-action"
  | "collaborate-action";

export const actionBuilders = {
  delete: (handler: () => Promise<void> | void): Action => ({
    label: "Delete",
    icon: "Delete",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "delete",
    dataTestId: "delete-action" as ActionTestId,
  }),

  archive: (handler: () => Promise<void> | void, confirmCategory?: "goal" | "collaboration"): Action => ({
    label: "Done",
    icon: "Correct",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: confirmCategory || "goal",
    confirmationAction: "archive",
    dataTestId: "archive-action" as ActionTestId,
  }),

  restore: (handler: () => Promise<void> | void, darkMode?: boolean): Action => ({
    label: "Restore",
    icon: React.createElement("img", {
      alt: "restore goal",
      src: unarchiveIcon,
      width: 24,
      height: 25,
      style: { filter: darkMode ? "invert(1)" : "none" },
    }),
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "restore",
    dataTestId: "restore-action" as ActionTestId,
  }),

  edit: (handler: () => void): Action => ({
    label: "Edit",
    icon: "Edit",
    onClick: handler,
    dataTestId: "edit-action" as ActionTestId,
  }),

  move: (handler: () => Promise<void> | void): Action => ({
    label: "Move",
    icon: "Move",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "move",
    dataTestId: "move-action" as ActionTestId,
  }),

  share: (handler: () => void): Action => ({
    label: "Share",
    icon: "SingleAvatar",
    onClick: handler,
    dataTestId: "share-action" as ActionTestId,
  }),

  report: (handler: () => Promise<void> | void, darkMode?: boolean, isLoading?: boolean): Action => ({
    label: "Report",
    icon: React.createElement("img", {
      alt: "report hint",
      src: unarchiveIcon,
      width: 24,
      height: 25,
      style: { filter: darkMode ? "invert(1)" : "none" },
    }),
    onClick: handler,
    loading: isLoading,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "reportHint",
    dataTestId: "report-hint-action" as ActionTestId,
  }),

  add: (handler: () => Promise<void> | void): Action => ({
    label: "Add",
    icon: "Add",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "addHint",
    dataTestId: "add-hint-action" as ActionTestId,
  }),

  deleteHint: (handler: () => Promise<void> | void): Action => ({
    label: "Delete",
    icon: "Delete",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "goal",
    confirmationAction: "deleteHint",
    dataTestId: "delete-hint-action" as ActionTestId,
  }),

  collaborate: (handler: () => Promise<void> | void): Action => ({
    label: "Collaborate",
    icon: "Collaborate",
    onClick: handler,
    requiresConfirmation: true,
    confirmationCategory: "collaboration",
    confirmationAction: "colabRequest",
    dataTestId: "collaborate-action" as ActionTestId,
  }),
};
