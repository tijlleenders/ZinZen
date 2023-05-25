/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { ILocationProps } from "@src/Interfaces/IPages";
import {
  displayAddGoal,
  displayChangesModal,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
  goalsHistory,
  popFromGoalsHistory } from "@src/store/GoalsState";
import MyGoal from "@components/GoalsComponents/MyGoal";
import AppLayout from "@src/layouts/AppLayout";
import ZAccordion from "@src/common/Accordion";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import GoalConfigModal from "@components/GoalsComponents/GoalConfigModal/GoalConfigModal";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import { darkModeState, displayInbox, displayToast, lastAction, searchActive } from "@src/store";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";

import "./MyGoalsPage.scss";
import Empty from "@src/common/Empty";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import DragAndDrop from "@src/layouts/DragAndDrop";

export const MyGoalsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUpdgradeAvailable = localStorage.getItem("updateAvailable") === "true";
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [loading, setLoading] = useState(false);
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const showAddGoal = useRecoilValue(displayAddGoal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const setShowToast = useSetRecoilState(displayToast);
  const setShowSuggestionsModal = useSetRecoilState(displaySuggestionsModal);

  const setSubGoalHistory = useSetRecoilState(goalsHistory);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);

  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<GoalItem | null>(null);

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals("true");
    handleUserGoals(goals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals("true");
    handleUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) { clearTimeout(debounceTimeout); }
    debounceTimeout = setTimeout(() => { search(event.target.value); }, 300);
  };

  const handleBackClick = () => {
    if (!showAddGoal && !showUpdateGoal) {
      navigate(-1);
    } else { popFromHistory(-1); }
  };

  const handleDragStart = (e, index: number) => {
    setDragging(true);
    setDraggedItem(activeGoals[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItem !== null) {
      const newItems = [...activeGoals];
      newItems.splice(index, 0, newItems.splice(activeGoals.indexOf(draggedItem), 1)[0]);
      setActiveGoals(newItems);
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDraggedItem(null);
  };

  useEffect(() => {
    if (action !== "none") {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action]);
  useEffect(() => {
    refreshActiveGoals();
  }, [showShareModal, openInbox, showAddGoal, showChangesModal, showUpdateGoal, showSuggestionModal, showChangesModal]);
  useEffect(() => {
    if (selectedGoalId === "root") { refreshActiveGoals(); }
  }, [selectedGoalId, displaySearch]);

  /* Usefull if navigation is from MyTimePage or external page/component */
  useEffect(() => {
    (async () => {
      const state = location.state as ILocationProps | null | undefined;
      if (state) {
        const { isRootGoal } = state;
        let { openGoalOfId } = state;
        if (!isRootGoal && openGoalOfId) {
          const tmpHistory = [];
          while (openGoalOfId !== "root") {
            const tmpGoal: GoalItem = await getGoal(openGoalOfId);
            tmpHistory.push(({
              goalID: tmpGoal.id || "root",
              goalColor: tmpGoal.goalColor || "#ffffff",
              goalTitle: tmpGoal.title || "",
              display: null
            }));
            openGoalOfId = tmpGoal.parentGoalId;
          }
          tmpHistory.reverse();
          setSubGoalHistory([...tmpHistory]);
          setSelectedGoalId(state.openGoalOfId);
        }
        location.state = null;
      }
    })();
  });

  return (
    <AppLayout title="My Goals" debounceSearch={debounceSearch}>
      <div className="myGoals-container">
        {
          selectedGoalId === "root" ? (
            <div className="my-goals-content">
              { showAddGoal && (<ConfigGoal action="Create" goal={createGoalObjectFromTags({})} />)}
              <div>
                { openInbox && isUpdgradeAvailable && (
                  <ZAccordion
                    showCount={false}
                    style={{
                      border: "none",
                      background: darkModeStatus ? "var(--secondary-background)" : "transparent"
                    }}
                    panels={[{ header: "Notifications",
                      body: (
                        <div className={`notification-item user-goal${darkModeStatus ? "-dark" : ""}`}>
                          <p>Upgrade Available !!</p>
                          <button
                            type="button"
                            onClick={async () => {
                              navigator.serviceWorker.register("../../service-worker.js")
                                .then((registration) => {
                                  if (registration.waiting) {
                                    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                                    localStorage.setItem("updateAvailable", "false");
                                    window.location.reload();
                                  }
                                });
                            }}
                            className={`default-btn${darkModeStatus ? "-dark" : ""}`}
                          >Upgrade Now
                          </button>
                        </div>
                      ) }]}
                  />
                )}
                { openInbox && !isUpdgradeAvailable && activeGoals.length === 0 && <Empty /> }
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {activeGoals.map((goal: GoalItem, index: number) => (
                    <>
                      { showUpdateGoal?.goalId === goal.id && <ConfigGoal action="Update" goal={goal} /> }
                      <DragAndDrop
                        thisItem={goal.id === draggedItem?.id}
                        index={index}
                        dragging={dragging}
                        handleDragStart={handleDragStart}
                        handleDragEnter={handleDragEnter}
                        handleDragEnd={handleDragEnd}
                      >
                        <MyGoal
                          goal={goal}
                          showActions={showActions}
                          setShowActions={setShowActions}
                        />
                      </DragAndDrop>
                    </>
                  ))}
                </div>
                <div className="archived-drawer">
                  { archivedGoals.length > 0 && (
                    <ZAccordion
                      showCount
                      style={{
                        border: "none",
                        background: darkModeStatus ? "var(--secondary-background)" : "transparent"
                      }}
                      panels={[{
                        header: "Done",
                        body: archivedGoals.map((goal: GoalItem) => (
                          <MyGoal
                            key={`goal-${goal.id}`}
                            goal={goal}
                            showActions={showActions}
                            setShowActions={setShowActions}
                          />
                        ))
                      }]}
                    />
                  )}
                </div>
              </div>
            </div>
          )
            :
            (<GoalSublist />)
        }
        { showChangesModal && <DisplayChangesModal /> }
      </div>
    </AppLayout>
  );
};
