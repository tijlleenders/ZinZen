import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { PlusLg, Trash3Fill, PencilSquare, CheckLg, ChevronRight, ChevronDown, ShareFill, PersonFill, PeopleFill } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Modal } from "react-bootstrap";

import addIcon from "@assets/images/GoalsAddIcon.svg";
import {
  archiveGoal,
  getActiveGoals,
  removeGoal,
  isCollectionEmpty,
  removeChildrenGoals,
  archiveChildrenGoals,
} from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import { GoalsHeader } from "@components/GoalsComponents/GoalsHeader/GoalsHeader";

import "./MyGoalsPage.scss";

interface ISubGoalHistoryProps {
  goalID: number,
  goalColor: string,
  goalTitle: string
}

export const MyGoalsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [tapCount, setTapCount] = useState([-1, 0]);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(-1);
  const [subGoalHistory, setSubGoalHistory] = useState<ISubGoalHistoryProps[]>([]);
  const titleRef = useRef(null);
  const darkModeStatus = useRecoilValue(darkModeState);
  let debounceTimeout: ReturnType<typeof setTimeout>;

  // async function populateDummyGoals() {
  //   const goal1 = createGoal("Goal1", false, 2, null, null, 0);
  //   const goal2 = createGoal("Goal2", true, 1, null, null, 0);
  //   const goal3 = createGoal("Goal3", true, 2, null, null, 0);
  //   const dummyData = [goal1, goal2, goal3];
  //   dummyData.map((goal: string) => addGoal(goal));
  // }
  const addInHistory = (goal: GoalItem) => {
    setSubGoalHistory([...subGoalHistory, ({
      goalID: goal.id || -1,
      goalColor: goal.goalColor || "#ffffff",
      goalTitle: goal.title || ""
    })]);
    setSelectedGoalId(goal.id || -1);
  };
  const popFromHistory = () => {
    subGoalHistory.pop();
    setSubGoalHistory(subGoalHistory);
    if (subGoalHistory.length === 0) { setSelectedGoalId(-1); } else { setSelectedGoalId(subGoalHistory.slice(-1)[0].goalID); }
  };
  async function archiveUserGoal(goal: GoalItem) {
    await archiveChildrenGoals(Number(goal.id));
    await archiveGoal(Number(goal.id));
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals);
  }
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
      // setSelectedGoalId(state ? state.id || -1 : -1);
      const goals: GoalItem[] = await getActiveGoals();
      setUserGoals(goals);
    })();
  }, [state]);
  return (
    <>
      <GoalsHeader popFromHistory={popFromHistory} />
      {
        selectedGoalId === -1 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              onClickCapture={() => setTapCount([-1, 0])}
              style={{
                marginTop: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
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
                    key={String(`task-${index}`)}
                    className="user-goal"
                    onClick={() => {
                      addInHistory(goal);
                    }}
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
                        ref={titleRef}
                        suppressContentEditableWarning
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          color: "white"
                        }}
                      >
                        {goal.title}
                      </div>
                      <div>
                        {tapCount[0] === index && tapCount[1] > 0 ? (
                          <ChevronDown fontSize="30px" />
                        ) : (
                          <ChevronRight
                            fontSize="30px"
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              setTapCount([index, tapCount[1] + 1]);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {tapCount[0] === index && tapCount[1] > 0 ? (
                      <div className="interactables">
                        <PlusLg
                          style={{ cursor: "pointer" }}
                          onClickCapture={() => navigate("/Home/AddGoals", { state: { goalId: goal.id } })}
                        />
                        <Trash3Fill
                          style={{ cursor: "pointer" }}
                          onClickCapture={(e) => {
                            e.stopPropagation();
                            removeUserGoal(Number(goal.id));
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
                          onClickCapture={() => navigate("/Home/AddGoals", { state: { editingGoal: true, goalId: goal.id } })}
                        />
                        <CheckLg
                          onClickCapture={async () => {
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
              <img
                onClick={() => {
                  navigate("/Home/AddGoals");
                }}
                id="addGoal-btn"
                src={addIcon}
                alt="add-goal"
                aria-hidden
              />
            </div>
            <Modal
              id="share-modal"
              show={showShareModal}
              onHide={() => setShowShareModal(false)}
              centered
              autoFocus={false}
            >
              <Modal.Body id="share-modal-body">
                <button type="button" className="shareOptions-btn">
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
        )
          : (
            <GoalSublist
              goalID={selectedGoalId}
              subGoalHistory={subGoalHistory}
              addInHistory={addInHistory}
            />
          )
}
    </>
  );
};
