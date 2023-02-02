/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayInbox, lastAction } from "@src/store";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import {
  displayAddGoal,
  displayAddGoalOptions,
  displayChangesModal,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
  goalsHistory } from "@src/store/GoalsState";
import { AddGoalForm } from "@components/GoalsComponents/AddGoal/AddGoalForm";
import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions/AddGoalOptions";
import MyGoal from "@components/GoalsComponents/MyGoal";

import "./MyGoalsPage.scss";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const showAddGoal = useRecoilValue(displayAddGoal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const setSubGoalHistory = useSetRecoilState(goalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);

  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals();
    setUserGoals(goals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) { clearTimeout(debounceTimeout); }
    debounceTimeout = setTimeout(() => { search(event.target.value); }, 300);
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
  }, [selectedGoalId]);

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
    <>
      { showAddGoalOptions && (
        <div className="overlay" onClick={() => setShowAddGoalOptions(false)}>
          <AddGoalOptions parentGoalId={selectedGoalId} />
        </div>
      )}
      <MainHeaderDashboard />
      {/* <GoalsHeader updateThisGoal={updateThisGoal} addThisGoal={addThisGoal} displayTRIcon={!showAddGoal && !showUpdateGoal ? "+" : "✓"} /> */}
      <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {
          selectedGoalId === "root" ? (
            <div className="my-goals-content">
              <input
                id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
                placeholder={t("search")}
                onChange={(e) => debounceSearch(e)}
              />
              <div className="sec-header">
                <button type="button" onClick={() => { setOpenInbox(false); }}>
                  <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${openInbox ? "" : "activeTab"}`}>
                    { t("mygoals") }
                  </h1>
                </button>
                <button type="button" onClick={() => { setOpenInbox(true); }}>
                  <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${!openInbox ? "" : "activeTab"}`}>
                    Inbox
                  </h1>
                </button>
              </div>
              { showAddGoal && (<AddGoalForm parentGoalId={showAddGoal.goalId} />)}
              <div>
                {userGoals?.map((goal: GoalItem) => (
                  showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm />
                    : (
                      <MyGoal
                        goal={goal}
                        showActions={showActions}
                        setShowActions={setShowActions}
                      />
                    )
                ))}
              </div>
            </div>
          )
            :
            (<GoalSublist />)
        }
        { showChangesModal && <DisplayChangesModal /> }
      </div>
    </>
  );
};
