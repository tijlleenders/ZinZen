import { PlusLg, Trash3Fill, PencilSquare, CheckLg, ChevronRight, ChevronDown } from "react-bootstrap-icons";
import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import addIcon from "@assets/images/GoalsAddIcon.svg";
import { archiveGoal, getChildrenGoals, getGoal, removeChildrenGoals, removeGoal, updateGoal } from "@src/api/GoalsAPI";
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

  useEffect(() => {
    getGoal(Number(goalID)).then((parent) => setParentGoal(parent));
    setTapCount([-1, 0]);
  }, [goalID]);

  useEffect(() => {
    getChildrenGoals(Number(goalID)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  }, [parentGoal]);

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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      color: "white"
                    }}
                    onClick={() => {
                      addInHistory(goal);
                    }}
                  >
                    {goal.title}
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
              </div>
            ))}
          </Container>
        </div>
      </div>
      <img
        onClick={() => {
          setShowAddGoals({
            open: true,
            goalId: parentGoal?.id
          });
        }}
        id="addGoal-btn"
        src={addIcon}
        alt="add-goal"
        aria-hidden
      />
    </div>
  );
};
