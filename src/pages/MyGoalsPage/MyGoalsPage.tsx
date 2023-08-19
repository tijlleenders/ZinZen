/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import Empty from "@src/common/Empty";
import { GoalItem } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { getActiveGoals } from "@api/GoalsAPI";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import {
  displayAddGoal,
  displayChangesModal,
  displayGoalActions,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
} from "@src/store/GoalsState";
import MyGoal from "@components/GoalsComponents/MyGoal";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";
import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import ZAccordion from "@src/common/Accordion";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";

import { anyUpdates, darkModeState, lastAction, openInbox, searchActive } from "@src/store";

import "./MyGoalsPage.scss";
import MyGoalActions from "@components/GoalsComponents/MyGoalActions/MyGoalActions";

export const MyGoalsPage = () => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const isInboxOpen = useRecoilValue(openInbox);
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
  const [isUpdgradeAvailable, setIsUpgradeAvailable] = useRecoilState(anyUpdates);

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = isInboxOpen ? await getActiveSharedWMGoals() : await getActiveGoals("true");
    handleUserGoals(goals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = isInboxOpen ? await getActiveSharedWMGoals() : await getActiveGoals("true");
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

  useEffect(() => {
    if (action !== "none") {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action]);
  useEffect(() => {
    refreshActiveGoals();
  }, [
    showShareModal,
    isInboxOpen,
    showAddGoal,
    showChangesModal,
    showUpdateGoal,
    showSuggestionModal,
    showChangesModal,
  ]);
  useEffect(() => {
    if (selectedGoalId === "root") {
      refreshActiveGoals();
    }
  }, [selectedGoalId, displaySearch]);

  return (
    <AppLayout title="mygoals" debounceSearch={debounceSearch}>
      <GoalLocStateHandler />
      {showGoalActions && <MyGoalActions open={!!showGoalActions} goal={showGoalActions} />}
      <div className="myGoals-container">
        {selectedGoalId === "root" ? (
          <div className="my-goals-content">
            {showAddGoal && <ConfigGoal action="Create" goal={createGoalObjectFromTags({})} />}
            <div>
              {isInboxOpen && isUpdgradeAvailable && (
                <ZAccordion
                  showCount={false}
                  style={{
                    border: "none",
                    background: darkModeStatus ? "var(--secondary-background)" : "transparent",
                  }}
                  panels={[
                    {
                      header: "Notifications",
                      body: (
                        <div className={`notification-item user-goal${darkModeStatus ? "-dark" : ""}`}>
                          <p style={{ color: "#000" }}>Update Available !!</p>
                          <button
                            type="button"
                            onClick={async () => {
                              navigator.serviceWorker.register("../../service-worker.js").then((registration) => {
                                if (registration.waiting) {
                                  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                                  setIsUpgradeAvailable(false);
                                  window.location.reload();
                                }
                              });
                            }}
                            className={`default-btn${darkModeStatus ? "-dark" : ""}`}
                          >
                            Update Now
                          </button>
                        </div>
                      ),
                    },
                  ]}
                />
              )}
              {isInboxOpen && !isUpdgradeAvailable && activeGoals.length === 0 && (
                <Empty subText="But ZinZen brought new updates for you" />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <GoalsList
                  goals={activeGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                  setGoals={setActiveGoals}
                />
              </div>
              <div className="archived-drawer">
                {archivedGoals.length > 0 && (
                  <ZAccordion
                    showCount
                    style={{
                      border: "none",
                      background: darkModeStatus ? "var(--secondary-background)" : "transparent",
                    }}
                    panels={[
                      {
                        header: "Done",
                        body: archivedGoals.map((goal: GoalItem) => (
                          <MyGoal
                            key={`goal-${goal.id}`}
                            goal={goal}
                            showActions={showActions}
                            setShowActions={setShowActions}
                          />
                        )),
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <GoalSublist />
        )}
        {showChangesModal && <DisplayChangesModal />}
        {activeGoals?.length === 0 && (
          <img
            style={{ width: 350, height: 350, opacity: 0.3 }}
            src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
            alt="Zinzen"
          />
        )}
      </div>
    </AppLayout>
  );
};
