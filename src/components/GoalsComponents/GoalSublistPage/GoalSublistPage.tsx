import { ChevronLeft, ChevronDown, PeopleFill, PersonFill } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Container, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { archiveUserGoal, getChildrenGoals, getGoal, removeChildrenGoals, removeGoal, shareMyGoal, updateGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import plus from "@assets/images/plus.svg";
import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import share from "@assets/images/share.svg";
import trash from "@assets/images/trash.svg";

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

  const archiveMyGoal = async (id: number) => {
    await archiveUserGoal(id);
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
                        setShowAddGoals({
                          open: true,
                          goalId: goal?.id
                        });
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
                      onClickCapture={async () => {
                        await shareMyGoal(goal, parentGoal ? parentGoal.title : "root");
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
