/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

import { archiveUserGoal, getChildrenGoals, getGoal, removeChildrenGoals, removeGoal, updateGoal } from "@src/api/GoalsAPI";
import { addInGoalsHistory, displayAddGoal, displayAddGoalOptions, displayGoalId, displaySuggestionsModal, displayUpdateGoal, goalsHistory, popFromGoalsHistory, resetGoalsHistory } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { darkModeState } from "@src/store";
import { AddGoalForm } from "../AddGoal/AddGoalForm";
import { UpdateGoalForm } from "../UpdateGoal/UpdateGoalForm";
import ShareGoalModal from "../ShareGoalModal/ShareGoalModal";

import "./GoalSublistPage.scss";
import DisplayChangesModal from "../DisplayChangesModal/DisplayChangesModal";
import { sendColabUpdatesToContact } from "@src/api/ContactsAPI";

export const GoalSublist = () => {
  const defaultTap = { open: "root", click: 1 };
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const goalID = useRecoilValue(displayGoalId);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const addInHistory = useSetRecoilState(addInGoalsHistory);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);
  const callResetHistory = useSetRecoilState(resetGoalsHistory);
  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

  const [tapCount, setTapCount] = useState(defaultTap);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showChangesModal, setShowChangesModal] = useState<GoalItem | null>(null);

  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [showShareModal, setShowShareModal] = useState(-1);

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
    getGoal(goalID).then((parent) => setParentGoal(parent));
    setTapCount(defaultTap);
  }, [goalID]);

  useEffect(() => {
    getChildrenGoals(goalID)
      .then((fetchedGoals) => {
        setChildrenGoals(fetchedGoals);
        setTapCount(defaultTap);
      });
  }, [showChangesModal, parentGoal, showAddGoal, showSuggestionModal, showUpdateGoal]);

  const archiveMyGoal = async (goal: GoalItem) => {
    if (goal.collaboration.status) {
      sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
        type: "goalCompleted",
        completed: [goal]
      }).then(() => console.log("complete update sent"));
    }
    await archiveUserGoal(goal);
    await getChildrenGoals(goalID).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  };
  const removeChildrenGoal = async (goalId: string) => {
    if (parentGoal?.sublist) {
      removeChildrenGoals(goalId);
      await removeGoal(goalId);
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goalId);
      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }
      await updateGoal(parentGoal.id, { sublist: parentGoalSublist });
      getChildrenGoals(goalID).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
    }
  };

  return (
    <div className="sublist-container">
      <Breadcrumb style={{ marginTop: "68px", padding: "0 18px" }}>
        <Breadcrumb.Item onClick={() => callResetHistory()}>
          <span style={{ color: darkModeStatus ? "white" : "black", backgroundColor: "#EDC7B7" }}>My Goals</span>
        </Breadcrumb.Item>
        {
          subGoalHistory.map((item, index) => (
            <Breadcrumb.Item
              key={`history-${item.goalID}-${item.goalTitle}.`}
              onClick={() => popFromHistory(index)}
            >
              <span style={{ color: darkModeStatus ? "white" : "black", backgroundColor: item.goalColor }}>
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
                    key={String(`goal-${goal.id}`)}
                    className={`user-goal${darkModeStatus ? "-dark" : ""}`}
                  >
                    <div
                      className="goal-dropdown"
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        handleDropDown(goal);
                      }}
                    >
                      { (
                        goal.collaboration.newUpdates ||
                        goal.collaboration.notificationCounter > 0
                      ) && <NotificationSymbol color={goal.goalColor} /> }
                      { goal.sublist.length > 0 && (
                        <div
                          className="goal-dd-outer"
                          style={{ borderColor: goal.goalColor }}
                        />
                      )}
                      <div
                        className="goal-dd-inner"
                        style={{
                          height: tapCount.open === goal.id && tapCount.click > 0 ? "90%" : "80%",
                          background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`
                        }}
                      />
                    </div>
                    <div
                      className="user-goal-main"
                      onClickCapture={() => { handleGoalClick(goal); }}
                      style={{ ...(tapCount.open === goal.id) ? { paddingBottom: 0 } : {} }}
                    >
                      <div
                        aria-hidden
                        className="goal-title"
                        suppressContentEditableWarning
                      >
                        <div>{goal.title}</div>&nbsp;
                        { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
                      </div>
                    </div>
                    {tapCount.open === goal.id && tapCount.click > 0 && (
                      <div className={`interactables${darkModeStatus ? "-dark" : ""}`}>
                        <img
                          alt="add subgoal"
                          src={plus}
                          style={{ cursor: "pointer" }}
                          onClickCapture={() => {
                            addInHistory(goal);
                            setShowAddGoalOptions(true);
                          }}
                        />
                        <img
                          alt="delete goal"
                          src={trash}
                          style={{ cursor: "pointer" }}
                          onClickCapture={() => {
                            if (goal.collaboration.status) {
                              sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
                                type: "goalDeleted",
                                deletedGoals: [goal]
                              }).then(() => console.log("update sent"));
                            }
                            removeChildrenGoal(goal.id);
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
                    { showChangesModal && <DisplayChangesModal showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} /> }

                  </div>
                )
            ))}
          </Container>
        </div>
      </div>
    </div>
  );
};
