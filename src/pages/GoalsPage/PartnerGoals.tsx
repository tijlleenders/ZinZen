import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams, useSearchParams } from "react-router-dom";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { darkModeState, lastAction, searchActive } from "@src/store";

import GoalsList from "@components/GoalsComponents/GoalsList";
import AppLayout from "@src/layouts/AppLayout";
import { getRootGoalsOfPartner } from "@src/api/SharedWMAPI";

import { usePartnerContext } from "@src/contexts/partner-context";
import { ParentGoalProvider } from "@src/contexts/parentGoal-context";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import { goalCategories } from "@src/constants/goals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import PartnersNavbar from "@components/PartnersNavbar";
import { TGoalConfigMode } from "@src/types";
import ArchivedGoals from "./components/ArchivedGoals";
import InvitationStatus from "./InvitationStatus";

const PartnerGoals = () => {
  const [searchParams] = useSearchParams();
  const { parentId = "root" } = useParams();

  let debounceTimeout: ReturnType<typeof setTimeout>;
  const showShareModal = searchParams.get("share") === "true";
  const showOptions = searchParams.get("showOptions") === "true";
  const goalType = (searchParams.get("type") as TGoalCategory) || "";
  const mode = (searchParams.get("mode") as TGoalConfigMode) || "";

  const { partner } = usePartnerContext();
  const { goal: activeGoal } = useActiveGoalContext();

  const { name = "", relId = "" } = partner || {};
  const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);

  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  // const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const displaySearch = useRecoilValue(searchActive);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [action, setLastAction] = useRecoilState(lastAction);

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };

  const refreshActiveGoals = async () => {
    const rootGoals = await getRootGoalsOfPartner(relId);
    handleUserGoals(rootGoals);
  };

  const search = async (text: string) => {
    const rootGoals = await getRootGoalsOfPartner(relId);
    handleUserGoals(rootGoals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };

  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      search(event.target.value);
    }, 300);
  };

  useEffect(() => {
    if (action !== "none" && action.includes("goal")) {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action]);

  useEffect(() => {
    if (parentId === "root") {
      refreshActiveGoals();
    }
  }, [parentId, partner, displaySearch]);

  return (
    <>
      <AppLayout title={`${partnerName}'s Goals`} debounceSearch={debounceSearch}>
        <ParentGoalProvider>
          {showOptions && activeGoal && <RegularGoalActions goal={activeGoal} />}
          {goalCategories.includes(goalType) && (
            <ConfigGoal type={goalType} goal={activeGoal || createGoalObjectFromTags()} mode={mode} />
          )}

          <div className="myGoals-container">
            {parentId === "root" ? (
              <div className="my-goals-content">
                <div className="d-flex f-col">
                  <GoalsList goals={activeGoals} setGoals={setActiveGoals} />
                </div>
                <ArchivedGoals goals={archivedGoals} display={archivedGoals.length > 0 ? "true" : "false"} />
              </div>
            ) : (
              <GoalSublist />
            )}

            {!activeGoals?.length && parentId === "root" && (
              <>
                <InvitationStatus relId={relId} />
                <img
                  style={{ width: 350, height: 350, opacity: 0.3 }}
                  src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
                  alt="Zinzen"
                />
              </>
            )}
          </div>
        </ParentGoalProvider>
      </AppLayout>
      <PartnersNavbar />
    </>
  );
};

export default PartnerGoals;
