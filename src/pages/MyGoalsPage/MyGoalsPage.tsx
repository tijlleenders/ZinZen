/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { ChevronLeft, ChevronDown } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

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
import ShareGoalModal from "@components/GoalsComponents/ShareGoalModal/ShareGoalModal";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const location = useLocation();

  const [tapCount, setTapCount] = useState([-1, 0]);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(-1);

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
      goalTags.afterTime ? goalTags.afterTime.value : null,
      goalTags.beforeTime ? goalTags.beforeTime.value : null,
      goalLang,
      goalTags.link ? goalTags.link.value.trim() : null,
      0,
      parentGoalId!,
      colorPallete[colorIndex], // goalColor
    );
    const newGoalId = await addGoal(newGoal);
    if (parentGoalId) {
      const parentGoal = await getGoal(parentGoalId);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(parentGoalId, { sublist: newSublist });
      if (selectedGoalId !== showAddGoal?.goalId) { addInHistory(parentGoal); }
    }

    setShowAddGoal(null);
    setGoalTags({});
    setGoalTitle("");
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
        afterTime: goalTags.afterTime ? goalTags.afterTime.value : null,
        beforeTime: goalTags.beforeTime ? goalTags.beforeTime.value : null,
      });
    setGoalTitle("");
    setShowUpdateGoal(null);
    setGoalTags({});
  };

  const archiveMyGoal = async (goal: GoalItem) => {
    await archiveUserGoal(goal);
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  };
  async function removeUserGoal(id: string) {
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
      // await populateDummyGoals();
      if (selectedGoalId === "root") {
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
      {
        selectedGoalId === "root" ?
          (
            <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                              className="goal-dropdown"
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
                                removeUserGoal(goal.id);
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
                              onClickCapture={() => {
                                setShowUpdateGoal({ open: true, goalId: goal?.id });
                              }}
                            />
                            <img
                              alt="archive Goal"
                              src={correct}
                              onClickCapture={async () => {
                                await archiveMyGoal(goal);
                              }}
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
