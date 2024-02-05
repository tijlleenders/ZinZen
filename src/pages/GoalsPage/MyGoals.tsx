/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import {
  displayAddGoal,
  displayChangesModal,
  displayGoalActions,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
} from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { getActiveGoals } from "@api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { darkModeState, lastAction, searchActive } from "@src/store";

import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import MyGoalActions from "@components/GoalsComponents/MyGoalActions/MyGoalActions";
import ShareGoalModal from "@components/GoalsComponents/ShareGoalModal/ShareGoalModal";
import ArchivedAccordion from "@components/GoalsComponents/ArchivedAccordion";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import { getAllImpossibleGoals } from "@src/api/ImpossibleGoalsApi";

export const MyGoals = () => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const showAddGoal = useRecoilValue(displayAddGoal);
  const displaySearch = useRecoilValue(searchActive);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showGoalActions = useRecoilValue(displayGoalActions);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const [action, setLastAction] = useRecoilState(lastAction);

  const priotizeImpossibleGoals = async (goals: GoalItem[]) => {
    try {
      const allImpossibleGoals = await getAllImpossibleGoals();
      const impossibleGoalIds = allImpossibleGoals.map((impossibleGoal) => impossibleGoal.goalId);
      const prioritizedGoals: GoalItem[] = [];
      const remainingGoals: GoalItem[] = [];
      goals.forEach((goal) => {
        if (impossibleGoalIds.includes(goal.id)) {
          prioritizedGoals.push(goal);
        } else {
          remainingGoals.push(goal);
        }
      });
      const sortedGoals = prioritizedGoals.concat(remainingGoals);
      return sortedGoals;
    } catch (error) {
      console.error("Error in priotizeImpossibleGoals:", error);
      throw error;
    }
  };

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = await getActiveGoals("true");
    const sortedGoals = await priotizeImpossibleGoals(goals);
    handleUserGoals(sortedGoals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = await getActiveGoals("true");
    handleUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      search(event.target.value);
    }, 300);
  };

  const zinZenLogoHeight = activeGoals.length > 0 ? "125px" : "350px";

  useEffect(() => {
    if (action !== "none") {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action]);
  useEffect(() => {
    refreshActiveGoals();
  }, [showShareModal, showAddGoal, showChangesModal, showUpdateGoal, showSuggestionModal, showChangesModal]);
  useEffect(() => {
    if (selectedGoalId === "root") {
      refreshActiveGoals();
    }
  }, [selectedGoalId, displaySearch]);

  return (
    <AppLayout title="myGoals" debounceSearch={debounceSearch}>
      {showShareModal && <ShareGoalModal goal={showShareModal} />}
      {showGoalActions && <MyGoalActions open={!!showGoalActions} goal={showGoalActions} />}
      {showChangesModal && <DisplayChangesModal />}
      <div className="myGoals-container">
        {selectedGoalId === "root" ? (
          <div className="my-goals-content">
            {showAddGoal && <ConfigGoal action="Create" goal={createGoalObjectFromTags({})} />}
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <GoalsList
                  goals={activeGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                  setGoals={setActiveGoals}
                />
              </div>
              {archivedGoals.length > 0 && (
                <ArchivedAccordion
                  archivedGoals={archivedGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                />
              )}
            </div>
          </div>
        ) : (
          <GoalSublist />
        )}

        <img
          style={{ width: 180, height: zinZenLogoHeight, opacity: 0.3 }}
          src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
          alt="Zinzen"
        />
      </div>
    </AppLayout>
  );
};
