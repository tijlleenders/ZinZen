/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { ChevronLeft, ChevronDown, PersonFill, PeopleFill } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "react-bootstrap";

import plus from "@assets/images/plus.svg";
import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

import {
  archiveUserGoal,
  getActiveGoals,
  removeGoal,
  removeChildrenGoals,
  getGoal,
  shareMyGoal,
  addGoal,
  createGoal,
  updateGoal
} from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
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
import { AddGoalForm } from "@components/GoalsComponents/AddGoal/AddGoalForm";
import { colorPallete } from "@src/utils";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions";
import { languagesFullForms } from "@src/translations/i18n";
import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";

import "./MyGoalsPage.scss";

interface ILocationProps {
  openGoalOfId: number,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tapCount, setTapCount] = useState([-1, 0]);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(false);

  const darkModeStatus = useRecoilValue(darkModeState);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const colorIndex = useRecoilValue(selectedColorIndex);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setSubGoalHistory = useSetRecoilState(goalsHistory);

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);

  let debounceTimeout: ReturnType<typeof setTimeout>;
  const typeOfPage = window.location.href.split("/").slice(-1)[0];
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const addThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const parentGoalId = showAddGoal?.goalId;
    const newGoal = createGoal(
      goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
      goalTags.repeats ? goalTags?.repeats.value.trim() : null,
      goalTags.duration ? goalTags.duration.value : null,
      goalTags.start ? goalTags.start.value : null,
      goalTags.due ? goalTags.due.value : null,
      goalTags.startTime ? goalTags.startTime.value : null,
      goalTags.endTime ? goalTags.endTime.value : null,
      0,
      parentGoalId!,
      colorPallete[colorIndex], // goalColor
      goalLang,
      goalTags.link ? goalTags.link.value.trim() : null
    );
    const newGoalId = await addGoal(newGoal);
    if (parentGoalId) {
      const parentGoal = await getGoal(parentGoalId);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(parentGoalId, { sublist: newSublist });
      if (selectedGoalId !== showAddGoal?.goalId) { addInHistory(parentGoal); }
    }

    const typeOfPage = window.location.href.split("/").slice(-1)[0];
    setShowAddGoal(null);
    setGoalTags({});
    setGoalTitle("");
    if (typeOfPage === "AddGoals") { navigate("/Home/MyGoals", { replace: true }); }
  };

  const updateThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      return;
    }
    await updateGoal(showUpdateGoal?.goalId,
      { title: goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
        goalColor: colorPallete[colorIndex],
        duration: goalTags.duration ? goalTags.duration.value : null,
        repeat: goalTags.repeats ? goalTags.repeats.value : null,
        link: goalTags.link ? goalTags.link.value?.trim() : null,
        start: goalTags.start ? goalTags.start.value : null,
        due: goalTags.due ? goalTags.due.value : null,
        startTime: goalTags.startTime ? goalTags.startTime.value : null,
        endTime: goalTags.endTime ? goalTags.endTime.value : null,
      });
    setGoalTitle("");
    setShowUpdateGoal(null);
    setGoalTags({});
  };

  const archiveMyGoal = async (id: number) => {
    await archiveUserGoal(id);
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  };
  async function removeUserGoal(id: number) {
    await removeChildrenGoals(id);
    await removeGoal(id);
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  }
  async function search(text: string) {
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  }
  function debounceSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      search(value);
    }, 300);
  }

  useEffect(() => {
    (async () => {
      // await populateDummyGoals();
      const goals: GoalItem[] = await getActiveGoals();
      setUserGoals(goals);
    })();
  }, [showAddGoal, showUpdateGoal, showSuggestionModal]);
  useEffect(() => {
    (async () => {
      if (typeOfPage === "AddGoals") {
        setShowAddGoal({ open: true, goalId: -1 });
      }
      // await populateDummyGoals();
      if (selectedGoalId === -1) {
        const goals: GoalItem[] = await getActiveGoals();
        setUserGoals(goals);
      }
    })();
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
          while (openGoalOfId !== -1) {
            const tmpGoal: GoalItem = await getGoal(openGoalOfId);
            tmpHistory.push(({
              goalID: tmpGoal.id || -1,
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
      {
        selectedGoalId === -1 ?
          (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                onClickCapture={() => setTapCount([-1, 0])}
                className="my-goals-content"
              >
                <input
                  id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
                  onClickCapture={() => setTapCount([-1, 0])}
                  placeholder="Search"
                  onChange={(e) => debounceSearch(e)}
                />
                <h1 id={darkModeStatus ? "myGoals_title-dark" : "myGoals_title"} onClickCapture={() => setTapCount([-1, 0])}>
                  My Goals
                </h1>
                { showAddGoal && (
                  <AddGoalForm
                    parentGoalId={showAddGoal.goalId}
                  />
                )}
                <div>
                  {userGoals?.map((goal: GoalItem, index) => (
                    showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm />
                      : (
                        <div
                          aria-hidden
                          key={String(`task-${goal.id}`)}
                          className="user-goal"
                          style={{ backgroundColor: goal.goalColor, cursor: "pointer" }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <div
                              aria-hidden
                              className="goal-title"
                              suppressContentEditableWarning
                              onClickCapture={() => {
                                if (!goal.sublist || goal.sublist?.length === 0) {
                                  if (tapCount[0] === index && tapCount[1] > 0) {
                                    setTapCount([-1, 0]);
                                  } else { setTapCount([index, tapCount[1] + 1]); }
                                } else {
                                  addInHistory(goal);
                                }
                              }}
                            >
                              <div>{goal.title}</div>&nbsp;
                              { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
                            </div>
                            <div
                              style={{ paddingLeft: "5%" }}
                              onClickCapture={() => {
                                if (tapCount[0] === index && tapCount[1] > 0) { setTapCount([-1, 0]); } else { setTapCount([index, tapCount[1] + 1]); }
                              }}
                            >
                              {tapCount[0] === index && tapCount[1] > 0 ? (
                                <ChevronDown fontSize="30px" />
                              ) : (
                                <ChevronLeft fontSize="30px" />
                              )}
                            </div>
                          </div>
                          {tapCount[0] === index && tapCount[1] > 0 && (
                          <div className="interactables">
                            <img
                              alt="add subgoal"
                              src={plus}
                              style={{ cursor: "pointer" }}
                              onClickCapture={() => {
                                addInHistory(goal);
                                setShowAddGoal({
                                  open: true,
                                  goalId: goal?.id
                                });
                              }}
                            />
                            <img
                              alt="delete goal"
                              src={trash}
                              style={{ cursor: "pointer" }}
                              onClickCapture={(e) => {
                                e.stopPropagation();
                                removeUserGoal(Number(goal.id));
                              }}
                            />
                            <img
                              alt="share goal"
                              src={share}
                              style={{ cursor: "pointer" }}
                              onClickCapture={(e) => {
                                e.stopPropagation();
                                setShowShareModal(true);
                              }}
                            />
                            <img
                              alt="Update Goal"
                              src={pencil}
                              style={{ cursor: "pointer" }}
                              onClickCapture={() => {
                                setShowUpdateGoal({ open: true, goalId: goal?.id });
                              }}
                            />
                            <img
                              alt="archive Goal"
                              src={correct}
                              onClickCapture={async () => {
                                await archiveMyGoal(goal.id);
                              }}
                              style={{ cursor: "Pointer" }}
                            />
                          </div>
                          )}
                          <Modal
                            id="share-modal"
                            show={showShareModal}
                            onHide={() => setShowShareModal(false)}
                            centered
                            autoFocus={false}
                          >
                            <Modal.Body id="share-modal-body">
                              <button
                                onClick={async () => {
                                  await shareMyGoal(goal, "root");
                                }}
                                type="button"
                                className="shareOptions-btn"
                              >
                                <div className="share-Options">
                                  <PersonFill />
                                  <p className="shareOption-name">Share Anonymously</p>
                                </div>
                              </button>
                              <button type="button" className="shareOptions-btn">
                                <div className="share-Options">
                                  <PeopleFill />
                                  <p className="shareOption-name">Share Public</p>
                                </div>
                              </button>
                              <button type="button" className="shareOptions-btn">
                                <div className="share-Options">
                                  <PersonFill />
                                  <p className="shareOption-name">Share with</p>
                                </div>
                              </button>
                            </Modal.Body>
                          </Modal>
                        </div>
                      )
                  ))}
                </div>
              </div>
            </div>
          )
          :
          (
            <GoalSublist />
          )
      }
    </>
  );
};
