/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { GoalItem } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { displayGoalActions, displayGoalId } from "@src/store/GoalsState";
import { darkModeState, lastAction, searchActive } from "@src/store";

import GoalsList from "@components/GoalsComponents/GoalsList";
import AppLayout from "@src/layouts/AppLayout";
import ContactItem from "@src/models/ContactItem";
import GoalsAccordion from "@components/GoalsComponents/GoalsAccordion";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";
import { getRootGoalsOfPartner } from "@src/api/SharedWMAPI";
import RegularGoalActions from "@components/GoalsComponents/MyGoalActions/RegularGoalActions";

import InvitationStatus from "./InvitationStatus";

const PartnerGoals = ({ partner }: { partner: ContactItem }) => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const { name, relId } = partner;
  const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);

  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  // const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const displaySearch = useRecoilValue(searchActive);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showGoalActions = useRecoilValue(displayGoalActions);
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
    if (selectedGoalId === "root") {
      refreshActiveGoals();
    }
  }, [selectedGoalId, partner, displaySearch]);

  return (
    <AppLayout title={`${partnerName}'s Goals`} debounceSearch={debounceSearch}>
      <GoalLocStateHandler />
      {/* {showGoalActions && <RegularGoalActions open goal={showGoalActions.goal} />} */}
      <div className="myGoals-container">
        {selectedGoalId === "root" ? (
          <div className="my-goals-content">
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <GoalsList goals={activeGoals} setGoals={setActiveGoals} />
              </div>
              <GoalsAccordion header="Done" goals={archivedGoals} />
            </div>
          </div>
        ) : (
          <GoalSublist />
        )}

        {activeGoals?.length === 0 && (
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
    </AppLayout>
  );
};

export default PartnerGoals;
