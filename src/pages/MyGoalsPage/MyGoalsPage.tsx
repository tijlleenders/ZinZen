/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import plus from "@assets/images/plus.svg";
import correct from "@assets/images/correct.svg";
import pencil from "@assets/images/pencil.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import { languagesFullForms } from "@translations/i18n";

import {
  archiveUserGoal,
  getActiveGoals,
  removeGoal,
  removeChildrenGoals,
  getGoal,
  addGoal,
  createGoalObjectFromTags,
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
import { colorPallete, getDefaultValueOfCollab } from "@src/utils";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions";

import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";

import "./MyGoalsPage.scss";
import ShareGoalModal from "@components/GoalsComponents/ShareGoalModal/ShareGoalModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { sendColabUpdatesToContact } from "@src/api/ContactsAPI";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import NotificationSymbol from "@src/common/NotificationSymbol";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const location = useLocation();
  const defaultTap = { open: "root", click: 1 };
  const [tapCount, setTapCount] = useState(defaultTap);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(-1);
  const [showChangesModal, setShowChangesModal] = useState<GoalItem | null>(null);

  const { t } = useTranslation();

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
  // @ts-ignore
  const goalLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const addThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const parentGoalId = showAddGoal?.goalId;
    const newGoal = createGoalObjectFromTags({
      language: goalLang,
      parentGoalId,
      title: goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
      repeat: goalTags.repeats ? goalTags?.repeats.value.trim() : null,
      duration: goalTags.duration ? goalTags.duration.value : null,
      start: goalTags.start ? goalTags.start.value : null,
      due: goalTags.due ? goalTags.due.value : null,
      afterTime: goalTags.afterTime ? goalTags.afterTime.value : null,
      beforeTime: goalTags.afterTime ? goalTags.afterTime.value : null,
      link: goalTags.link ? `${goalTags.link.value}`.trim() : null,
      goalColor: colorPallete[colorIndex]
    });

    if (parentGoalId && parentGoalId !== "root") {
      const newGoalId = await addGoal(newGoal);
      const parentGoal = await getGoal(parentGoalId);
      if (parentGoal.collaboration.status === "accepted") {
        sendColabUpdatesToContact(parentGoal.collaboration.relId, parentGoalId, {
          type: "goalAdded",
          subgoals: [{ ...newGoal, id: newGoalId, collaboration: { ...getDefaultValueOfCollab(), allowed: false } }]
        }).then(() => console.log("update sent"));
      }
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(parentGoalId, { sublist: newSublist });
      // @ts-ignore
      if (selectedGoalId !== showAddGoal?.goalId) { addInHistory(parentGoal); }
    } else { await addGoal(newGoal); }

    setShowAddGoal(null);
    // @ts-ignore
    setGoalTags({});
    setGoalTitle("");
  };
  const updateThisGoal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (goalTitle.length === 0) {
      return;
    }
    if (showUpdateGoal) {
      await updateGoal(showUpdateGoal.goalId,
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
      getGoal(showUpdateGoal.goalId).then((goal: GoalItem) => {
        if (goal.collaboration.status) {
          sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
            type: "goalEdited",
            updatedGoals: [goal]
          }).then(() => { console.log("edit updates sent"); });
        }
      });
      setGoalTitle("");
      setShowUpdateGoal(null);
      // @ts-ignore
      setGoalTags({});
    }
  };
  const archiveMyGoal = async (goal: GoalItem) => {
    await archiveUserGoal(goal);
    if (goal.collaboration.status) {
      sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
        type: "goalCompleted",
        completedGoals: [goal]
      }).then(() => console.log("complete update sent"));
    }
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
  function handleDropDown(goal: GoalItem) {
    if (tapCount.open === goal.id && tapCount.click > 0) {
      setTapCount(defaultTap);
    } else if (goal.collaboration.newUpdates) {
      setShowChangesModal(goal);
    } else setTapCount({ open: goal.id, click: 1 });
  }

  useEffect(() => {
    (async () => {
      const goals: GoalItem[] = await getActiveGoals();
      setUserGoals(goals);
    })();
  }, [showAddGoal, showUpdateGoal, showSuggestionModal, showChangesModal]);
  useEffect(() => {
    (async () => {
      // await populateDummyGoals();
      if (selectedGoalId === "root") {
        const goals: GoalItem[] = await getActiveGoals();
        setUserGoals(goals);
      }
    })();
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
          selectedGoalId === "root" ?
            (
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
                <h1 id={darkModeStatus ? "myGoals_title-dark" : "myGoals_title"} onClickCapture={() => setTapCount([-1, 0])}>
                  {t("mygoals")}
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
                            { goal.collaboration.newUpdates && <NotificationSymbol color={goal.goalColor} /> }
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
                                onClickCapture={(e) => {
                                  e.stopPropagation();
                                  if (goal.collaboration.status) {
                                    sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
                                      type: "goalDeleted",
                                      deletedGoals: [goal]
                                    }).then(() => console.log("update sent"));
                                  }
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
            )
            :
            (<GoalSublist />)
        }
        { showChangesModal && <DisplayChangesModal showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} /> }
      </div>
    </>
  );
};
