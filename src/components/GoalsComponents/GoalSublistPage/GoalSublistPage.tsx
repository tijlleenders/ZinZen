import React, { useEffect, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { ChevronLeft, ChevronDown } from "react-bootstrap-icons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

import { archiveUserGoal, getChildrenGoals, getGoal, removeChildrenGoals, removeGoal, updateGoal } from "@src/api/GoalsAPI";
import { addInGoalsHistory, displayAddGoal, displayGoalId, displaySuggestionsModal, displayUpdateGoal, goalsHistory, popFromGoalsHistory, resetGoalsHistory } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { AddGoalForm } from "../AddGoal/AddGoalForm";
import { UpdateGoalForm } from "../UpdateGoal/UpdateGoalForm";
import ShareGoalModal from "../ShareGoalModal/ShareGoalModal";

import "./GoalSublistPage.scss";

export const GoalSublist = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const goalID = useRecoilValue(displayGoalId);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);
  const callResetHistory = useSetRecoilState(resetGoalsHistory);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);

  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [tapCount, setTapCount] = useState([-1, 0]);
  const [showShareModal, setShowShareModal] = useState(-1);

  useEffect(() => {
    getGoal(Number(goalID)).then((parent) => setParentGoal(parent));
    setTapCount([-1, 0]);
  }, [goalID]);

  useEffect(() => {
    getChildrenGoals(Number(goalID))
      .then((fetchedGoals) => {
        if (!showAddGoal && fetchedGoals.length === 0) {
          popFromHistory(-1);
        } else {
          setChildrenGoals(fetchedGoals);
          setTapCount([-1, 0]);
        }
      });
  }, [parentGoal, showAddGoal, showSuggestionModal, showUpdateGoal]);

  const archiveMyGoal = async (goal: GoalItem) => {
    await archiveUserGoal(goal);
    await getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  };
  const removeChildrenGoal = async (goalId: number) => {
    if (parentGoal?.sublist) {
      // delete subgoals of this goal
      removeChildrenGoals(goalId);
      // removeGoal(goalId)
      await removeGoal(goalId);
      // remove childGoalId from parentGoal.sublist
      const parentGoalSublist: number[] = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goalId);
      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }
      // update parentGoal with new parentGoal.sublist
      await updateGoal(Number(parentGoal.id), { sublist: parentGoalSublist });
      // getChildrenGoals again
      getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
    }
  };
  const updateUserGoals = async (goal: GoalItem, index: number) => {
    const updatedTitle = document.querySelector(`.goal-title:nth-child(${index + 1}`)?.textContent;
    if (updatedTitle && tapCount[0] === index && updatedTitle !== goal.title) {
      if (updatedTitle.length === 0) return;
      await updateGoal(Number(goal.id), { title: updatedTitle });
      getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
    }
  };

  return (
    <div className={darkModeStatus ? "sublist-container-dark" : "sublist-container"}>
      <Breadcrumb style={{ marginTop: "80px" }}>
        <Breadcrumb.Item onClick={() => callResetHistory()}>
          <span style={{ backgroundColor: "#EDC7B7", borderRadius: "8px", padding: "5px" }}>My Goals</span>
        </Breadcrumb.Item>
        {
          subGoalHistory.map((item, index) => (
            <Breadcrumb.Item
              key={`history-${item.goalID}-${item.goalTitle}.`}
              onClick={() => popFromHistory(index)}
            >
              <span style={{ backgroundColor: item.goalColor, borderRadius: "8px", padding: "5px" }}>
                {item.goalTitle }
              </span>
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
      <div className="sublist-content-container">
        <div className="sublist-content">
          <div className="sublist-title">{parentGoal?.title}</div>
          <Container fluid className="sublist-list-container">
            { showAddGoal && <AddGoalForm parentGoalId={showAddGoal.goalId} /> }

            {childrenGoals?.map((goal: GoalItem, index) => (
              showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm />
                : (
                  <div
                    aria-hidden
                    key={String(`goal-${goal.id}`)}
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
                          <ChevronDown
                            fontSize="30px"
                          />
                        ) : (
                          <ChevronLeft
                            fontSize="30px"
                          />
                        )}
                      </div>
                    </div>
                    {tapCount[0] === index && tapCount[1] > 0 ? (
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
                            addInHistory(goal);
                          }}
                        />
                        <img
                          alt="delete goal"
                          src={trash}
                          style={{ cursor: "pointer" }}
                          onClickCapture={() => {
                            removeChildrenGoal(Number(goal.id));
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
                    ) : null}
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
          </Container>
        </div>
      </div>
    </div>
  );
};
