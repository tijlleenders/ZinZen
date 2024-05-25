/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import {
  displayAddGoal,
  displayChangesModal,
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
import ShareGoalModal from "@components/GoalsComponents/ShareGoalModal/ShareGoalModal";
import GoalsAccordion from "@components/GoalsComponents/GoalsAccordion";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import { TrashItem } from "@src/models/TrashItem";
import { getDeletedGoals } from "@src/api/TrashAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";
import MoveGoalGuide from "@components/GoalsComponents/MyGoal/MoveGoalGuide";

export const MyGoals = () => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const showAddGoal = useRecoilValue(displayAddGoal);
  const displaySearch = useRecoilValue(searchActive);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const [action, setLastAction] = useRecoilState(lastAction);

  const getAllGoals = async () => {
    const [goals, delGoals] = await Promise.all([getActiveGoals("true"), getDeletedGoals("root")]);
    console.log("🚀 ~ getAllGoals ~ goals, delGoals:", goals, delGoals);
    return { goals, delGoals };
  };
  const handleUserGoals = (goals: GoalItem[], delGoals: TrashItem[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDeletedGoals([...delGoals.map(({ deletedAt, ...goal }) => goal)]);
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const { goals, delGoals } = await getAllGoals();
    const sortedGoals = await priotizeImpossibleGoals(goals);
    handleUserGoals(sortedGoals, delGoals);
  };
  const search = async (text: string) => {
    const { goals, delGoals } = await getAllGoals();
    handleUserGoals(
      goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      delGoals.filter(({ deletedAt, ...goal }) => goal.title.toUpperCase().includes(text.toUpperCase())),
    );
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

  const goalWrapperRef = useRef(null);

  return (
    <AppLayout title="myGoals" debounceSearch={debounceSearch}>
      {showShareModal && <ShareGoalModal goal={showShareModal} />}
      {showChangesModal && <DisplayChangesModal />}
      <div className="myGoals-container" ref={goalWrapperRef}>
        <MoveGoalGuide goalComponentRef={goalWrapperRef} />

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
                <GoalsAccordion
                  header="Done"
                  goals={archivedGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                />
              )}
              {deletedGoals.length > 0 && (
                <GoalsAccordion
                  header="Trash"
                  goals={deletedGoals}
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
