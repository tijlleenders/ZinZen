/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayInbox, displayToast } from "@src/store";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import { GoalsHeader } from "@components/GoalsComponents/GoalsHeader/GoalsHeader";
import {
  addInGoalsHistory,
  displayAddGoal,
  displayAddGoalOptions,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
  extractedTitle,
  goalsHistory,
  inputGoalTags,
  selectedColorIndex } from "@src/store/GoalsState";
import { colorPallete } from "@src/utils";
import { AddGoalForm } from "@components/GoalsComponents/AddGoal/AddGoalForm";
import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions/AddGoalOptions";
import { createGoal, modifyGoal } from "@src/helpers/GoalController";
import MyGoal from "@components/GoalsComponents/MyGoal";

import "./MyGoalsPage.scss";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [lastAction, setLastAction] = useState("");
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showChangesModal, setShowChangesModal] = useState<GoalItem | null>(null);
  const colorIndex = useRecoilValue(selectedColorIndex);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const showShareModal = useRecoilValue(displayShareModal);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setSubGoalHistory = useSetRecoilState(goalsHistory);
  const setShowToast = useSetRecoilState(displayToast);

  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);

  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals();
    setUserGoals(goals);
  };
  const isTitleEmpty = () => {
    if (goalTitle.length === 0) { setShowToast({ open: true, message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`, extra: "" }); }
    return goalTitle.length === 0;
  };
  const resetCurrentStates = () => {
    if (showAddGoal) { setShowAddGoal(null); } else if (showUpdateGoal) { setShowUpdateGoal(null); }
    // @ts-ignore
    setGoalTags({});
    setGoalTitle("");
  };
  const addThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!showAddGoal || isTitleEmpty()) { return; }
    const { parentGoal } = await createGoal(showAddGoal.goalId, goalTags, goalTitle, colorPallete[colorIndex]);
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) { addInHistory(parentGoal); }
    resetCurrentStates();
  };
  const updateThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    await modifyGoal(showUpdateGoal.goalId, goalTags, goalTitle, colorPallete[colorIndex]);
    resetCurrentStates();
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
    refreshActiveGoals();
  }, [showShareModal, openInbox, lastAction, showAddGoal, showUpdateGoal, showSuggestionModal, showChangesModal]);
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
      <GoalsHeader updateThisGoal={updateThisGoal} addThisGoal={addThisGoal} displayTRIcon={!showAddGoal && !showUpdateGoal ? "+" : "✓"} />
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
              { showAddGoal && (<AddGoalForm parentGoalId={showAddGoal.goalId} addThisGoal={addThisGoal} />)}
              <div>
                {userGoals?.map((goal: GoalItem) => (
                  showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm updateThisGoal={updateThisGoal} />
                    : (
                      <MyGoal
                        goal={goal}
                        showActions={showActions}
                        setShowActions={setShowActions}
                        setLastAction={setLastAction}
                      />
                    )
                ))}
              </div>
            </div>
          )
            :
            (<GoalSublist addThisGoal={addThisGoal} updateThisGoal={updateThisGoal} />)
        }
        { showChangesModal && <DisplayChangesModal showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} /> }
      </div>
    </>
  );
};
