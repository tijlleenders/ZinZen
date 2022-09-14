/* eslint-disable no-await-in-loop */
import React, { useState, useEffect, ChangeEvent } from "react";
import { ChevronLeft, ChevronDown, PersonFill, PeopleFill } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "react-bootstrap";

import {
  archiveUserGoal,
  getActiveGoals,
  removeGoal,
  removeChildrenGoals,
  getGoal,
  shareMyGoal
} from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import { GoalsHeader } from "@components/GoalsComponents/GoalsHeader/GoalsHeader";
import { AddGoal } from "@components/GoalsComponents/AddGoal/AddGoal";
import { UpdateGoal } from "@components/GoalsComponents/UpdateGoal/UpdateGoal";
import plus from "@assets/images/plus.svg";
import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

import "./MyGoalsPage.scss";
import { addInGoalsHistory, displayAddGoal, displayGoalId, displayUpdateGoal, goalsHistory } from "@src/store/GoalsHistoryState";

interface ILocationProps {
  openGoalOfId: number,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const location = useLocation();

  const [tapCount, setTapCount] = useState([-1, 0]);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(false);

  const darkModeStatus = useRecoilValue(darkModeState);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const setSubGoalHistory = useSetRecoilState(goalsHistory);

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);

  let debounceTimeout: ReturnType<typeof setTimeout>;
  const typeOfPage = window.location.href.split("/").slice(-1)[0];

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
  }, [showAddGoal, showUpdateGoal]);
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
      <GoalsHeader displayTRIcon={!showAddGoal && !showUpdateGoal ? "+" : "?"} />
      {
        showAddGoal ?
          <AddGoal />
          :
          showUpdateGoal ?
            <UpdateGoal />
            :
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
                    <div>
                      {userGoals?.map((goal: GoalItem, index) => (
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
