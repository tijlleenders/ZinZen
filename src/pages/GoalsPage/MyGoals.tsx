/* eslint-disable complexity */
import React from "react";
import { useRecoilValue } from "recoil";

import { Outlet } from "@tanstack/react-router";

import { searchQueryState } from "@src/store/GoalsState";

import GoalsList from "@components/GoalsComponents/GoalsList";

import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";
import { Route } from "@src/routes/(mygoalRoutes)/goals.$parentId";
import ZinZenBgImage from "./ZinZenBgImage";
import SubgoalLayout from "./SubgoalLayout";
import AvailableGoalHints from "./components/AvailableGoalHints";

// TODO: re-implement sorting priority goals

export const MyGoals = () => {
  const { parentId } = Route.useParams();
  const { activeGoals } = useGetActiveGoals(parentId);
  const searchQuery = useRecoilValue(searchQueryState);

  // const isActiveGoalIdEmpty = activeGoalId === "";
  // const { data: activeGoal } = useGetGoalById(activeGoalId || "", isActiveGoalIdEmpty);
  const { archivedGoals, isLoading: isArchivedGoalsLoading } = useGetArchivedGoals(parentId);
  const { deletedGoals, isLoading: isDeletedGoalsLoading } = useGetDeletedGoals(parentId);
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
    <>
      <div className="myGoals-container">
        {isSublist && (
          <SubgoalLayout
            subgoalsPresent={filteredActiveGoals && filteredActiveGoals.length > 0}
            parentGoal={parentGoal}
          />
        )}
        <div className="my-goals-content">
          <GoalsList goals={filteredActiveGoals || []} />
          {isSublist && <AvailableGoalHints hints={hints || []} />}
          {!isDeletedGoalsLoading && <DeletedGoals deletedGoals={deletedGoals || []} />}
          {!isArchivedGoalsLoading && <ArchivedGoals goals={archivedGoals || []} />}
        </div>

        <ZinZenBgImage activeGoalsPresent={filteredActiveGoals && filteredActiveGoals.length > 0} />
      </div>
      {/* {activeGoal && location.state?.actionModalType === ActionModal.ACTIVE && <GoalModals activeGoal={activeGoal} />} */}
      <Outlet />
    </>
  );
};
