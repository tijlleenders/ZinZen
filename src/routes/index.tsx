import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import useApp from "@src/hooks/useApp";
import { TGoalConfigMode } from "@src/types";
import { TGoalCategory } from "@src/models/GoalItem";

const IndexComponent = () => {
  const { isLanguageChosen } = useApp();

  if (!isLanguageChosen) {
    return <LandingPage />;
  }

  return <MyTimePage />;
};

export const Route = createFileRoute("/")({
  component: IndexComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { addOptions?: boolean; type?: TGoalCategory; mode?: TGoalConfigMode } => {
    return {
      addOptions: search.addOptions as boolean,
      type: search.type as TGoalCategory,
      mode: search.mode as TGoalConfigMode,
    };
  },
});
