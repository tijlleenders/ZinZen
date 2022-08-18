import { PlusLg, Trash3Fill, ShareFill, PencilSquare, CheckLg, ChevronRight, ChevronDown, PeopleFill, PersonFill } from "react-bootstrap-icons";
import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Container, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { archiveGoal, getChildrenGoals, getGoal, removeChildrenGoals, removeGoal, shareGoal, updateGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";

import "./GoalSublistPage.scss";

interface ISubGoalHistoryProps {
  goalID: number,
  goalColor: string,
  goalTitle: string
}
interface GoalSublistProps {
  goalID: number,
  subGoalHistory: ISubGoalHistoryProps[],
  addInHistory: (goal: GoalItem) => void,
  setShowAddGoals: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
  }>>
  setShowUpdateGoal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    goalId: number;
  }>>,
  resetHistory: () => void,
  popFromHistory: (index?: number) => void
}

export const GoalSublist: React.FC<GoalSublistProps> = ({ goalID, subGoalHistory, addInHistory, resetHistory, popFromHistory, setShowAddGoals, setShowUpdateGoal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [tapCount, setTapCount] = useState([-1, 0]);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    getGoal(Number(goalID)).then((parent) => setParentGoal(parent));
    setTapCount([-1, 0]);
  }, [goalID]);

  useEffect(() => {
    getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  }, [parentGoal]);

  const shareMyGoal = async (goal: GoalItem) => {
    const shareableGoal = {
      method: "shareGoal",
      parentTitle: parentGoal?.title,
      goal: {
        title: goal.title,
        duration: goal.duration,
        repeat: goal.repeat,
        start: goal.start,
        finish: goal.finish,
        createdAt: goal.createdAt,
        goalColor: goal.goalColor,
        language: goal.language,
        link: goal.link
      }
    };
    shareGoal(shareableGoal);
  };
  const archiveUserGoal = async (goal: GoalItem) => {
    await archiveGoal(Number(goal.id));
    getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
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
        <Breadcrumb.Item onClick={() => { resetHistory(); }}>
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
            {childrenGoals?.map((goal: GoalItem, index) => (
              <div
                aria-hidden
                key={String(`goal-${index}`)}
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
                      <ChevronRight
                        fontSize="30px"
                      />
                    )}
                  </div>
                </div>
                {tapCount[0] === index && tapCount[1] > 0 ? (
                  <div className="interactables">
                    <PlusLg
                      style={{ cursor: "pointer" }}
                      onClickCapture={() => {
                        setShowAddGoals({
                          open: true,
                          goalId: goal?.id
                        });
                      }}
                    />
                    <Trash3Fill
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        removeChildrenGoal(Number(goal.id));
                      }}
                    />
                    <ShareFill
                      style={{ cursor: "pointer" }}
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        setShowShareModal(true);
                      }}
                    />
                    <PencilSquare
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowUpdateGoal({ open: true, goalId: goal?.id });
                      }}
                    />
                    <CheckLg
                      onClick={async () => {
                        archiveUserGoal(goal);
                        getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
                      }}
                      style={{ cursor: "Pointer" }}
                    />
                  </div>
                ) : null}
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
                        await shareMyGoal(goal);
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
          </Container>
        </div>
      </div>
    </div>
  );
};
