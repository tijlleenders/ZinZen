import { Trash3Fill, PencilSquare, CheckLg } from "react-bootstrap-icons";
import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import addIcon from "@assets/images/GoalsAddIcon.svg";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { archiveGoal, getChildrenGoals, getGoal, removeGoal, updateGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";

import "./GoalSublist.scss";

export const GoalSublist: React.FC = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [parentGoal, setParentGoal] = useState<GoalItem>();
  const [childrenGoals, setChildrenGoals] = useState<GoalItem[]>([]);
  const [userUpdatingTitle, setUserUpdatingTitle] = useState(false);
  const [tapCount, setTapCount] = useState([-1, 0]);
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    getGoal(Number(param.id)).then((parent) => setParentGoal(parent));
  }, [param]);

  useEffect(() => {
    getChildrenGoals(Number(param.id)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  }, [parentGoal]);

  const archiveUserGoal = async (goal: GoalItem) => {
    const updatedGoalStatus = { status: 1 };
    await archiveGoal(Number(goal.id), updatedGoalStatus);
    getChildrenGoals(Number(param.id)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
  };
  const removeChildrenGoal = async (goalId: number) => {
    if (parentGoal?.sublist) {
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
      getChildrenGoals(Number(param.id)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
    }
  };
  const updateUserGoals = async (goal: GoalItem, index: number) => {
    const updatedTitle = document.querySelector(`.goal-title:nth-child(${index + 1}`)?.textContent;
    if (updatedTitle && tapCount[0] === index && updatedTitle !== goal.title) {
      if (updatedTitle.length === 0) return;
      await updateGoal(Number(goal.id), { title: updatedTitle });
      getChildrenGoals(Number(param.id)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
    }
  };

  return (
    <div>
      <HeaderDashboard />
      <div className={darkModeStatus ? "sublist-container-dark" : "sublist-container"}>
        <Breadcrumb style={{ marginTop: "80px" }}>
          <Breadcrumb.Item href="/Home/MyGoals/">My Goals</Breadcrumb.Item>
          <Breadcrumb.Item href="#">{parentGoal?.title}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="sublist-content-container">
          <div className="sublist-content">
            <div className="sublist-title">{parentGoal?.title}</div>
            <Container fluid className="sublist-list-container">
              {childrenGoals?.map((goal: GoalItem, index) => (
                <div
                  key={String(`goal-${index}`)}
                  className="user-goal"
                  onClickCapture={() => {
                    setTapCount([index, tapCount[1] + 1]);
                  }}
                >
                  <div
                    className="goal-title"
                    contentEditable={userUpdatingTitle && tapCount[0] === index && tapCount[1] >= 1}
                    onClickCapture={() => setTapCount([index, tapCount[1] + 1])}
                    ref={titleRef}
                    onBlur={() => {
                      updateUserGoals(goal, index);
                    }}
                    suppressContentEditableWarning
                    style={{
                      cursor: userUpdatingTitle ? "unset" : "default",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {goal.title}
                  </div>
                  {tapCount[0] === index && tapCount[1] > 0 ? (
                    <div className="interactables">
                      <Trash3Fill
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          removeChildrenGoal(Number(goal.id));
                        }}
                      />
                      <PencilSquare
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (titleRef.current) (titleRef.current as HTMLElement).focus();
                          setUserUpdatingTitle(!userUpdatingTitle);
                        }}
                      />
                      <CheckLg
                        onClick={async () => {
                          archiveUserGoal(goal);
                          getChildrenGoals(Number(param.id)).then((fetchedGoals) => setChildrenGoals(fetchedGoals));
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
            navigate("/Home/AddGoals", { state: { goalId: parentGoal?.id } });
          }}
          id="addGoal-btn"
          src={addIcon}
          alt="add-goal"
          aria-hidden
        />
      </div>
    </div>
  );
};
