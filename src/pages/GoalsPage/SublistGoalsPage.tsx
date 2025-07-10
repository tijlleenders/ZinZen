import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useRecoilValue } from "recoil";
import { searchQueryState } from "@src/store/GoalsState";
import { goalCategories } from "@src/constants/goals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import AppLayout from "@src/layouts/AppLayout";
import GoalModals from "./GoalModals";

const SublistGoalsPage = () => {
  const { parentId, activeGoalId } = useParams();
  const { data: activeGoal } = useGetGoalById(activeGoalId || "");
  const { activeGoals, isLoading } = useGetActiveGoals(parentId || "");
  const [searchParams] = useSearchParams();
  const searchQuery = useRecoilValue(searchQueryState);

  const goalType = (searchParams.get("type") as TGoalCategory) || "";

  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const filteredActiveGoals = activeGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AppLayout title="myGoals">
      <div className="myGoals-container">
        <GoalSublist key={parentId} goals={filteredActiveGoals || []} isLoading={isLoading} />
        {/* Modals */}
        {goalCategories.includes(goalType) && (
          <ConfigGoal
            key={`${mode}-${activeGoalId}`}
            type={goalType}
            goal={mode === "edit" && activeGoal ? activeGoal : createGoalObjectFromTags()}
            mode={mode}
          />
        )}
        {activeGoal && <GoalModals activeGoal={activeGoal} />}
      </div>
    </AppLayout>
  );
};

export default SublistGoalsPage;
