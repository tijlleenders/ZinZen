/* eslint-disable complexity */
import React from "react";
import { useRecoilValue } from "recoil";

import { Outlet } from "@tanstack/react-router";

import { searchQueryState } from "@src/store/GoalsState";

import GoalsList from "@components/GoalsComponents/GoalsList";

import { TrashItem } from "@src/models/TrashItem";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";
import ZinZenBgImage from "./ZinZenBgImage";
import SubgoalLayout from "./SubgoalLayout";
import AvailableGoalHints from "./components/AvailableGoalHints";
import "./MyGoals.scss";

// TODO: re-implement sorting priority goals

interface MyGoalsProps {
  activeGoals: GoalItem[];
  deletedGoals: TrashItem[];
  archivedGoals: GoalItem[];
  parentId: string;
}

export const MyGoals = ({ activeGoals, deletedGoals, archivedGoals, parentId }: MyGoalsProps) => {
  const searchQuery = useRecoilValue(searchQueryState);

  const { data: parentGoal } = useGetGoalById(parentId);

  const filteredActiveGoals = activeGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const isSublist = parentId !== "root";

  const hints =
    parentGoal && parentGoal.hints?.availableGoalHints
      ? parentGoal.hints.availableGoalHints.map((hint) =>
          createGoalObjectFromTags({ ...hint, parentGoalId: parentId, id: hint.id }),
        )
      : [];

  return (
    <div className="goals-container">
      {isSublist && (
        <SubgoalLayout
          subgoalsPresent={filteredActiveGoals && filteredActiveGoals.length > 0}
          parentGoal={parentGoal}
        />
      )}
      <div className="my-goals-content">
        <GoalsList goals={filteredActiveGoals || []} />
        {isSublist && <AvailableGoalHints hints={hints || []} />}
        <DeletedGoals deletedGoals={deletedGoals || []} />
        <ArchivedGoals goals={archivedGoals || []} />
      </div>

      <ZinZenBgImage activeGoalsPresent={filteredActiveGoals && filteredActiveGoals.length > 0} />
      <Outlet />
    </div>
  );
};
