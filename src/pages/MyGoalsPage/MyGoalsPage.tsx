// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { PlusLg, Trash3Fill, PencilSquare, CheckLg } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import addIcon from "@assets/images/GoalsAddIcon.svg";
import { archiveGoal, getActiveGoals, removeGoal, updateGoal, isCollectionEmpty } from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

import "./MyGoalsPage.scss";

export const MyGoalsPage = () => {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState([-1, 0]);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [userUpdatingTitle, setUserUpdatingTitle] = useState(false);
  const titleRef = useRef(null);
  let debounceTimeout: ReturnType<typeof setTimeout>;

  // async function populateDummyGoals() {
  //   const goal1 = createGoal("Goal1", false, 2, null, null, 0);
  //   const goal2 = createGoal("Goal2", true, 1, null, null, 0);
  //   const goal3 = createGoal("Goal3", true, 2, null, null, 0);
  //   const dummyData = [goal1, goal2, goal3];
  //   dummyData.map((goal: string) => addGoal(goal));
  // }

  async function updateUserGoals(goal: GoalItem, index: number) {
    const updatedTitle = document.querySelector(`.goal-title:nth-child(${index + 1}`)?.textContent;
    if (updatedTitle && tapCount[0] === index && updatedTitle !== goal.title) {
      if (updatedTitle.length === 0) return;
      await updateGoal(goal.id, { title: updatedTitle });
      const goals: GoalItem[] = await getActiveGoals();
      setUserGoals(goals);
    }
  }
  async function archiveUserGoal(goal: GoalItem) {
    const updatedGoalStatus = { status: 1 };
    await archiveGoal(goal.id, updatedGoalStatus);
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  }
  async function removeUserGoal(id: number) {
    await removeGoal(id);
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  }
  async function search(text: string) {
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  }
  function debounceSearch(event) {
    const { value } = event.target;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      search(value);
    }, 300);
  }

  useEffect(() => {
    async function checkCollection() {
      const result = await isCollectionEmpty();
      return result;
    }
    checkCollection().then((result) => {
      const timer1 = setTimeout(() => {
        if (result) {
          navigate("/Home/AddGoals", {
            state: { feelingDate: new Date() },
          });
        }
      }, 500);
      return () => {
        clearTimeout(timer1);
      };
    });
  }, []);

  useEffect(() => {
    (async () => {
      // await populateDummyGoals();
      const goals: GoalItem[] = await getActiveGoals();
      setUserGoals(goals);
    })();
  }, []);

  return (
    <div id="myGoals-container" onClickCapture={() => setTapCount([-1, 0])}>
      <Container fluid>
        <input
          id="goal-searchBar"
          onClickCapture={() => setTapCount([-1, 0])}
          placeholder="Search"
          onChange={(e) => debounceSearch(e)}
        />
        <h1 id="myGoals_title" onClickCapture={() => setTapCount([-1, 0])}>
          My Goals
        </h1>
        <div id="myGoals-list">
          {userGoals?.map((goal: GoalItem, index) => (
            <div
              key={String(`task-${index}`)}
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
                style={{ cursor: userUpdatingTitle ? "unset" : "default" }}
              >
                {goal.title}
              </div>
              {tapCount[0] === index && tapCount[1] > 0 ? (
                <div className="interactables">
                  <PlusLg style={{ cursor: "pointer" }} />
                  <Trash3Fill
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      removeUserGoal(goal.id);
                    }}
                  />
                  <PencilSquare
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      titleRef.current?.focus();
                      setUserUpdatingTitle(!userUpdatingTitle);
                    }}
                  />
                  <CheckLg
                    onClick={async () => {
                      archiveUserGoal(goal);
                      const updatedGoalsList = await getActiveGoals();
                      setUserGoals(updatedGoalsList);
                    }}
                    style={{ cursor: "Pointer" }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            navigate("/Home/AddGoals");
          }}
        >
          <img id="addGoal-btn" src={addIcon} alt="add-goal" />
        </button>
      </Container>
    </div>
  );
};
