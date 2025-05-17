/* eslint-disable complexity */
import React, { useRef } from "react";
import { useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { TGoalCategory } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { darkModeState } from "@src/store";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";

import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import ShareGoalModal from "@pages/GoalsPage/components/modals/ShareGoalModal";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";

import { useParams, useSearchParams } from "react-router-dom";
import { ParentGoalProvider } from "@src/contexts/parentGoal-context";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import Participants from "@components/GoalsComponents/Participants";

import { TGoalConfigMode } from "@src/types";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import { goalCategories } from "@src/constants/goals";
import { useGetGoalById } from "@src/hooks/api/Goals/useGetGoalById";
import { useGetActiveGoals } from "@src/hooks/api/Goals/useGetActiveGoals";
import DeletedGoals from "./components/DeletedGoals";
import ArchivedGoals from "./components/ArchivedGoals";

import "./GoalsPage.scss";

export const MyGoals = () => {
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const { parentId = "root", activeGoalId } = useParams();
  const { activeGoals } = useGetActiveGoals("root");
  const { data: activeGoal } = useGetGoalById(activeGoalId || "");
  // const [sortedGoals, setSortedGoals] = useState<GoalItem[]>([]);

  const [searchParams] = useSearchParams();
  const showShareModal = searchParams.get("share") === "true";
  const showOptions = searchParams.get("showOptions") === "true" && activeGoal && activeGoal.archived === "false";

  const showParticipants = searchParams.get("showParticipants") === "true";
  const showNewChanges = searchParams.get("showNewChanges") === "true";

  const goalType = (searchParams.get("type") as TGoalCategory) || "";

  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const darkModeStatus = useRecoilValue(darkModeState);

  const goalWrapperRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!activeGoals) return;
  //   priotizeImpossibleGoals(activeGoals).then(setSortedGoals);
  // }, [activeGoals]);

  // const refreshActiveGoals = async () => {
  //   const { goals, delGoals } = await getAllGoals();
  //   const sortedGoals = await priotizeImpossibleGoals(goals);
  // };
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

  const zinZenLogoHeight = activeGoals && activeGoals.length > 0 ? 125 : 350;

  // useEffect(() => {
  //   if (action === "goalArchived") return;
  //   if (action !== "none" || goalToMove === null) {
  //     setLastAction("none");
  //     refreshActiveGoals();
  //   }
  // }, [action, goalToMove]);

  // useEffect(() => {
  //   if (parentId === "root") {
  //     refreshActiveGoals();
  //   }
  // }, [parentId, displaySearch, suggestedGoal, goalToMove]);

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
                <GoalsList goals={activeGoals || []} />
              </div>
              <DeletedGoalProvider>
                <DeletedGoals />
              </DeletedGoalProvider>
              <ArchivedGoals />
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
