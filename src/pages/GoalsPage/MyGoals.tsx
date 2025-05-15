/* eslint-disable complexity */
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { getActiveRootGoals } from "@api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { darkModeState, lastAction, searchActive } from "@src/store";

import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import ShareGoalModal from "@pages/GoalsPage/components/modals/ShareGoalModal";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import { getDeletedGoals } from "@src/api/TrashAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";

import { useParams, useSearchParams } from "react-router-dom";
import { ParentGoalProvider } from "@src/contexts/parentGoal-context";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import Participants from "@components/GoalsComponents/Participants";

import { TGoalConfigMode } from "@src/types";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import { goalCategories } from "@src/constants/goals";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { moveGoalState } from "@src/store/moveGoalState";
import { useGetActiveRootGoals } from "@src/hooks/api/Goals/useGetActiveRootGoals";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/useGetDeletedGoals";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";

export const MyGoals = () => {
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const { activeRootGoals } = useGetActiveRootGoals();
  const { deletedGoals } = useGetDeletedGoals("root");

  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);

  const { parentId = "root" } = useParams();
  const { goal: activeGoal } = useActiveGoalContext();

  const [searchParams] = useSearchParams();
  const showShareModal = searchParams.get("share") === "true";
  const showOptions = searchParams.get("showOptions") === "true" && activeGoal && activeGoal.archived === "false";

  const showParticipants = searchParams.get("showParticipants") === "true";
  const showNewChanges = searchParams.get("showNewChanges") === "true";

  const goalType = (searchParams.get("type") as TGoalCategory) || "";

  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const suggestedGoal = useRecoilValue(suggestedGoalState);
  const displaySearch = useRecoilValue(searchActive);
  const darkModeStatus = useRecoilValue(darkModeState);
  const goalToMove = useRecoilValue(moveGoalState);

  const [action, setLastAction] = useRecoilState(lastAction);

  const goalWrapperRef = useRef<HTMLDivElement | null>(null);

  const getAllGoals = async () => {
    const [goals, delGoals] = await Promise.all([getActiveRootGoals(), getDeletedGoals("root")]);
    return { goals, delGoals };
  };

  const handleUserGoals = (goals: GoalItem[]) => {
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const { goals, delGoals } = await getAllGoals();
    const sortedGoals = await priotizeImpossibleGoals(goals);

    console.log("goals", goals);
    console.log("delGoals", delGoals);

    handleUserGoals(sortedGoals);
  };
  // const search = async (text: string) => {
  //   const { goals, delGoals } = await getAllGoals();
  //   handleUserGoals(
  //     goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())),
  //     deletedGoals?.filter(({ deletedAt, ...goal }) => goal.title.toUpperCase().includes(text.toUpperCase())),
  //   );
  // };
  // const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (debounceTimeout) {
  //     clearTimeout(debounceTimeout);
  //   }
  //   debounceTimeout = setTimeout(() => {
  //     search(event.target.value);
  //   }, 300);
  // };

  const zinZenLogoHeight = activeRootGoals && activeRootGoals.length > 0 ? 125 : 350;

  useEffect(() => {
    if (action === "goalArchived") return;
    if (action !== "none" || goalToMove === null) {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action, goalToMove]);

  useEffect(() => {
    if (parentId === "root") {
      refreshActiveGoals();
    }
  }, [parentId, displaySearch, suggestedGoal, goalToMove]);

  return (
    <ParentGoalProvider>
      <AppLayout title="myGoals" debounceSearch={() => {}}>
        {showOptions && <RegularGoalActions goal={activeGoal} />}
        {showShareModal && activeGoal && <ShareGoalModal goal={activeGoal} />}
        {showParticipants && <Participants />}
        {showNewChanges && activeGoal && <DisplayChangesModal currentMainGoal={activeGoal} />}

        {goalCategories.includes(goalType) && (
          <ConfigGoal
            type={goalType}
            goal={mode === "edit" && activeGoal ? activeGoal : createGoalObjectFromTags()}
            mode={mode}
          />
        )}

        <div className="myGoals-container" ref={goalWrapperRef}>
          {parentId === "root" ? (
            <div className="my-goals-content">
              <div className="d-flex f-col">
                <GoalsList goals={activeRootGoals || []} />
              </div>
              <DeletedGoalProvider>
                {deletedGoals && deletedGoals.length > 0 && <DeletedGoals goals={deletedGoals} />}
              </DeletedGoalProvider>
              <ArchivedGoals goals={archivedGoals} />
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
    </ParentGoalProvider>
  );
};
