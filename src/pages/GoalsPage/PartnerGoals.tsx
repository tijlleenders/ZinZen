/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { GoalItem } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { displayGoalActions, displayGoalId } from "@src/store/GoalsState";
import { darkModeState, displayToast, lastAction, searchActive } from "@src/store";

import ArchivedAccordion from "@components/GoalsComponents/ArchivedAccordion";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";
import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import MyGoalActions from "@components/GoalsComponents/MyGoalActions/MyGoalActions";
import ContactItem from "@src/models/ContactItem";
import { getRootGoalsOfPartner } from "@src/api/SharedWMAPI";
import { addToSharingQueue, checkAndUpdateRelationshipStatus } from "@src/api/ContactsAPI";

const PartnerGoals = ({ partner }: { partner: ContactItem }) => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  console.log(partner.name);
  const { name, relId } = partner;
  const partnerName = name.charAt(0).toUpperCase() + name.slice(1, 4);
  const [relationshipStatus, setRelationshipStatus] = useState(false);

  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const displaySearch = useRecoilValue(searchActive);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showGoalActions = useRecoilValue(displayGoalActions);
  const setShowToast = useSetRecoilState(displayToast);

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

  useEffect(async () => {
    const status = await checkAndUpdateRelationshipStatus(partner.relId);
    setRelationshipStatus(status);
    console.log("Name: ", name, "Status: ", status);
  }, [relId]);

  const handleSendInvitation = async () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
    setShowToast({
      open: true,
      message: "Link copied to clipboard",
      extra: "Once your partner accepts the invitation link - your goals will be shared automatically",
    });
  };

  return (
    <AppLayout title={`${partnerName}'s Goals`} debounceSearch={debounceSearch}>
      <GoalLocStateHandler />
      {showGoalActions && <MyGoalActions open={!!showGoalActions} goal={showGoalActions} />}
      <div className="myGoals-container">
        {selectedGoalId === "root" ? (
          <div className="my-goals-content">
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <GoalsList
                  goals={activeGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                  setGoals={setActiveGoals}
                />
              </div>
              <ArchivedAccordion
                archivedGoals={archivedGoals}
                showActions={showActions}
                setShowActions={setShowActions}
              />
            </div>
          </div>
        ) : (
          <GoalSublist />
        )}

        {activeGoals?.length === 0 && (
          <>
            <p style={{ textAlign: "center", margin: "0 20px" }}>
              {relationshipStatus
                ? "Your partner has accepted the sharing request but has not started sharing anything with you."
                : "Your partner has not accepted the sharing request yet. Click the button below to share again."}
            </p>
            {relationshipStatus === false && (
              <button
                type="button"
                className={`default-btn${darkModeStatus ? "-dark" : ""}`}
                style={{ alignSelf: "center" }}
                onClick={handleSendInvitation}
              >
                {" "}
                Share link
              </button>
            )}
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
