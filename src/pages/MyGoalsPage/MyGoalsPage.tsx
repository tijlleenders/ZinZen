/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayToast } from "@src/store";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import { GoalsHeader } from "@components/GoalsComponents/GoalsHeader/GoalsHeader";
import {
  addInGoalsHistory,
  displayAddGoal,
  displayAddGoalOptions,
  displayGoalId,
  displaySuggestionsModal,
  displayUpdateGoal,
  extractedTitle,
  goalsHistory,
  inputGoalTags,
  selectedColorIndex } from "@src/store/GoalsState";
import { colorPallete } from "@src/utils";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { AddGoalForm } from "@components/GoalsComponents/AddGoal/AddGoalForm";
import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";
import ShareGoalModal from "@components/GoalsComponents/ShareGoalModal/ShareGoalModal";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions/AddGoalOptions";
import { archiveGoal, createGoal, deleteGoal, modifyGoal } from "@src/helpers/GoalController";

import "./MyGoalsPage.scss";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const defaultTap = { open: "root", click: 1 };
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [tapCount, setTapCount] = useState(defaultTap);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(-1);
  const [showChangesModal, setShowChangesModal] = useState<GoalItem | null>(null);

  const colorIndex = useRecoilValue(selectedColorIndex);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setSubGoalHistory = useSetRecoilState(goalsHistory);
  const setShowToast = useSetRecoilState(displayToast);

  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);

  // @ts-ignore

  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = await getActiveGoals();
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
    await createGoal(showAddGoal.goalId, goalTags, goalTitle, colorPallete[colorIndex]);
    resetCurrentStates();
  };
  const updateThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    await modifyGoal(showUpdateGoal.goalId, goalTags, goalTitle, colorPallete[colorIndex]);
    resetCurrentStates();
  };
  const archiveThisGoal = async (goal: GoalItem) => {
    await archiveGoal(goal);
    await refreshActiveGoals();
  };
  const removeThisGoal = async (goal: GoalItem) => {
    await deleteGoal(goal);
    await refreshActiveGoals();
  };

  const search = async (text: string) => {
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) { clearTimeout(debounceTimeout); }
    debounceTimeout = setTimeout(() => { search(event.target.value); }, 300);
  };
  const handleGoalClick = (goal: GoalItem) => {
    if (goal.sublist.length === 0) {
      if (tapCount.open === goal.id && tapCount.click > 0) {
        setTapCount(defaultTap);
      } else { setTapCount({ open: goal.id, click: 1 }); }
    } else {
      // @ts-ignore
      addInHistory(goal);
    }
  };
  const handleDropDown = (goal: GoalItem) => {
    if (tapCount.open === goal.id && tapCount.click > 0) {
      setTapCount(defaultTap);
    } else if (goal.collaboration.newUpdates) {
      setShowChangesModal(goal);
    } else setTapCount({ open: goal.id, click: 1 });
  };

  useEffect(() => {
    refreshActiveGoals();
  }, [showAddGoal, showUpdateGoal, showSuggestionModal, showChangesModal]);
  useEffect(() => {
    if (selectedGoalId === "root") { refreshActiveGoals(); }
  }, [selectedGoalId, showShareModal]);

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
            <div
              onClickCapture={() => setTapCount(defaultTap)}
              className="my-goals-content"
            >
              <input
                id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
                onClickCapture={() => setTapCount(defaultTap)}
                placeholder={t("search")}
                onChange={(e) => debounceSearch(e)}
              />
              <h1 id={darkModeStatus ? "myGoals_title-dark" : "myGoals_title"} onClickCapture={() => setTapCount(defaultTap)}>
                {t("mygoals")}
              </h1>
              { showAddGoal && (<AddGoalForm parentGoalId={showAddGoal.goalId} addThisGoal={addThisGoal} />)}
              <div>
                {userGoals?.map((goal: GoalItem, index) => (
                  showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm updateThisGoal={updateThisGoal} />
                    : (
                      <div
                        key={String(`task-${goal.id}`)}
                        className={`user-goal${darkModeStatus ? "-dark" : ""}`}
                      >
                        <div
                          className="goal-dropdown"
                          onClickCapture={(e) => {
                            e.stopPropagation();
                            handleDropDown(goal);
                          }}
                        >
                          { (goal.collaboration.newUpdates || goal.collaboration.notificationCounter > 0) && <NotificationSymbol color={goal.goalColor} /> }
                          { goal.sublist.length > 0 && (
                            <div
                              className="goal-dd-outer"
                              style={{ borderColor: goal.goalColor }}
                            />
                          )}
                          <div
                            className="goal-dd-inner"
                            style={{
                              background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)`,
                              height: tapCount.open === goal.id && tapCount.click > 0 ? "90%" : "80%"
                            }}
                          />
                        </div>
                        <div
                          onClickCapture={() => { handleGoalClick(goal); }}
                          className="user-goal-main"
                          style={{ ...(tapCount.open === goal.id) ? { paddingBottom: 0 } : {} }}
                        >
                          <div
                            aria-hidden
                            className="goal-title"
                            suppressContentEditableWarning
                          >
                            <div>{goal.title}</div>&nbsp;
                            { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClickCapture={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
                          </div>
                        </div>

                        { (goal.shared || goal.collaboration.status !== "none") && (
                        <OverlayTrigger
                          trigger="click"
                          placement="top"
                          overlay={<Tooltip id="tooltip-disabled"> {goal.shared?.name || goal.collaboration.name} </Tooltip>}
                        >
                          <div
                            className="contact-button"
                          >
                            { goal.collaboration.status === "accepted" && (
                            <img
                              alt="collaborate goal"
                              src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
                              style={{ width: "27px", position: "absolute", right: "18px" }}
                            />
                            ) }
                            <button
                              type="button"
                              className="contact-icon"
                              style={{ background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)` }}
                            >
                              {goal.shared?.name[0] || goal.collaboration.name[0]}
                            </button>
                          </div>

                        </OverlayTrigger>
                        )}
                        {tapCount.open === goal.id && tapCount.click > 0 && (
                        <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
                          <img
                            alt="add subgoal"
                            src={plus}
                            style={{ cursor: "pointer" }}
                            onClickCapture={() => {
                              // @ts-ignore
                              addInHistory(goal);
                              setShowAddGoalOptions(true);
                            }}
                          />
                          <img
                            alt="delete goal"
                            src={trash}
                            style={{ cursor: "pointer" }}
                            onClickCapture={async (e) => {
                              e.stopPropagation();
                              await removeThisGoal(goal);
                            }}
                          />
                          <img
                            alt="share goal"
                            src={share}
                            style={{ cursor: "pointer" }}
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              setShowShareModal(index);
                            }}
                          />
                          <img
                            alt="Update Goal"
                            src={pencil}
                            style={{ cursor: "pointer" }}
                            onClickCapture={() => { setShowUpdateGoal({ open: true, goalId: goal?.id }); }}
                          />
                          <img
                            alt="archive Goal"
                            src={correct}
                            onClickCapture={async () => { await archiveThisGoal(goal); }}
                            style={{ cursor: "Pointer" }}
                          />
                        </div>
                        )}
                        {showShareModal === index && (
                          <ShareGoalModal
                            goal={goal}
                            showShareModal={showShareModal}
                            setShowShareModal={setShowShareModal}
                          />
                        )}
                      </div>
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
