import ConfigGoal from "@components/ConfigGoal/ConfigGoal";
import GoalItemSummary from "@components/GoalItemSummary/GoalItemSummary";
import GoalHistory from "@components/GoalsComponents/GoalSublist/components/GoalHistory";
import { GoalItem } from "@src/models/GoalItem";
import { searchQueryState } from "@src/store/GoalsState";
import { useRouterState } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import "./SubgoalLayout.scss";
import "@src/components/GoalsComponents/GoalSublist/GoalSublist.scss";

const SubgoalLayout = ({
  subgoalsPresent = false,
  isLoadingSubgoals = false,
  parentGoal,
}: {
  subgoalsPresent?: boolean;
  isLoadingSubgoals?: boolean;
  parentGoal?: GoalItem;
}) => {
  const { t } = useTranslation();
  const [showConfig, setShowConfig] = useState(!subgoalsPresent);
  const prevSubgoalsPresentRef = useRef(subgoalsPresent);

  useEffect(() => {
    if (!prevSubgoalsPresentRef.current && subgoalsPresent && showConfig) {
      setShowConfig(false);
    }
    prevSubgoalsPresentRef.current = subgoalsPresent;
  }, [subgoalsPresent, showConfig]);
  const goalsHistory = useRouterState({
    select: (state) => state.location.state.goalsHistory || [],
  });

  const handleToggleConfig = () => {
    setShowConfig(!showConfig);
  };
  const searchQuery = useRecoilValue(searchQueryState);
  return (
    <>
      <GoalHistory showConfig={showConfig} setShowConfig={setShowConfig} goalsHistory={goalsHistory} />
      <button className="clickable-container" type="button" onClick={handleToggleConfig}>
        {!showConfig ? (
          <>
            <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
            {parentGoal && <GoalItemSummary goal={parentGoal} variant="default" />}
          </>
        ) : null}
      </button>
      <div className="sublist-list-container" style={{ marginTop: !showConfig ? "10px" : "0px" }}>
        {showConfig && !isLoadingSubgoals && parentGoal && searchQuery === "" && (
          <div className="config-goal-container">
            <ConfigGoal
              key={`edit-${parentGoal.id}`}
              goal={parentGoal}
              type={parentGoal?.category}
              mode="edit"
              useModal={false}
              onToggleConfig={handleToggleConfig}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SubgoalLayout;
