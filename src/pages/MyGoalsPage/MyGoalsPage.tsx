/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayInbox, lastAction, searchActive } from "@src/store";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import {
  displayAddGoal,
  displayAddGoalOptions,
  displayChangesModal,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
  goalsHistory } from "@src/store/GoalsState";
import { AddGoalForm } from "@components/GoalsComponents/AddGoal/AddGoalForm";
import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";
import AddGoalOptions from "@components/GoalsComponents/AddGoalOptions/AddGoalOptions";
import MyGoal from "@components/GoalsComponents/MyGoal";

import "./MyGoalsPage.scss";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

interface ILocationProps {
  openGoalOfId: string,
  isRootGoal: boolean
}

export const MyGoalsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const showAddGoal = useRecoilValue(displayAddGoal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const setSubGoalHistory = useSetRecoilState(goalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showAddGoalOptions, setShowAddGoalOptions] = useRecoilState(displayAddGoalOptions);

  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals();
    setUserGoals(goals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = await getActiveGoals();
    setUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) { clearTimeout(debounceTimeout); }
    debounceTimeout = setTimeout(() => { search(event.target.value); }, 300);
  };

  useEffect(() => {
    if (action !== "none") {
      setLastAction("none");
      refreshActiveGoals();
    }
  }, [action]);
  useEffect(() => {
    refreshActiveGoals();
  }, [showShareModal, openInbox, showAddGoal, showChangesModal, showUpdateGoal, showSuggestionModal, showChangesModal]);
  useEffect(() => {
    if (selectedGoalId === "root") { refreshActiveGoals(); }
  }, [selectedGoalId, displaySearch]);

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
      <MainHeaderDashboard />
      {/* <GoalsHeader updateThisGoal={updateThisGoal} addThisGoal={addThisGoal} displayTRIcon={!showAddGoal && !showUpdateGoal ? "+" : "✓"} /> */}
      <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {
          selectedGoalId === "root" ? (
            <div className="my-goals-content">
              { displaySearch && (
                <input
                  id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
                  placeholder={t("search")}
                  onChange={(e) => debounceSearch(e)}
                />
              )}
              { !displaySearch && (
                <div className="sec-header">
                  <button type="button" onClick={() => { setOpenInbox(false); }}>
                    <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${openInbox ? "" : "activeTab"}`}>
                      { t("mygoals") }
                    </h1>
                  </button>
                  <button type="button" onClick={() => { setDisplaySearch(true); }}>
                    <img
                      alt="search goal"
                      style={{ width: "35px", marginTop: "10px", height: "30px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEiElEQVR4nO2WWUhjVxjHb0ppC31oaQvzVJzqQKGFUltsC+3UvpT2rYU+1IGOUig+mGjcTW6W660YZcqMWVpFx5ukhiRqxiUoopAxNe4bcauJqRvquC9xi8Zx+pXv0CtWBqaQTEPBDw4n5yZwfvf//3/nhKIuKzwlyMvLe4mKVBUXF3/Esmwpy7LDhYWF3qKioqmCggKvUqnso2m6SCKRXHvqEHa7/QrHcfc0Gs0flZWVgerqamhoaAC73U5ms9kMFRUVuyqVyiOVSjUMw7zwVECCweDb3d3dbr1ef9jY2AhdXV0wMzMDa2trsLOzAysrK+D1esHpdEJdXR2UlpZu0jTdwTDMa2EFcTgcVwYHB91VVVUnbW1tZNONjQ3Y29uDQCAAR0dHcHh4CLu7u7C+vg5jY2PQ3NyMKu3TNH2fYZjnwgZjMpnu6fX6AwSZmJggG/r9fgKAIMfHx2Q+ODg4U8ntdkNTUxPodLoVmqYVYQFRqVQfarVaH1ozMDAACwsLsL29TTZGVRCEHwi0v78Pm5ubMDs7C729vVBTUwMsy3okEsmrIcPIZLJfOI47bG9vh8nJSVheXj6zJxgMknFyckIGfka1ULWlpSUYHx8HVPNvdX4IGUYqlQ5ZrVbo6+sjb4sWYTZQiYsgvDr4/erqKvh8Pujs7ASj0fiQpmlbqCwChULhxbYdHh6G+fl5YgFawVvEw+DANR9kDDjC9/f3Ax4BSqWyKySSrKysFxUKxRTmxe12n+XlPAyvznll0EaEmZubIznD3OTn5w+GqgxF0/RkfX09DA0NPVYZPjd8iPE53+KoDNprsVhAoVA4Q4ZJT0/vMZvNf2JnTE9Pk0PuYluf76bz7T01NQUulwsMBsOxUqk0hAwjFAoLysvL/Q6Hg5wxi4uLsLW1RazAjREK1cCBaz4vaOno6Ci0tLSAVqtdYFn2m5BhRCLRGzKZzGOz2Yjk2CHYtmgXKoRQOBACFUEQBPZ4PKSTLBbLI7VaPRK2eyolJeW2VqtdxyMeA4lA+OZoBUIhAGYE1/gcQdBW7EKO4/x373LfUeEqvFtSU1OdZWVlewjU09NDDjSEwssSuwZnzMjIyAhRBEHwwsTQa7Q/l1MUCMIGlJGR8UpaWlprSUnJA2xVPFkxnGgdqoVzR0cHyYjZbH5kNBr9Vms1sQzD3dLaWndHrdOEDYphmGdFIlFubm7u72q1+oHBYHiIbYtw+F9Gr9cfY1h1Ot2IyWS6UVtb+1NiYhKxLhAInG77hr3Jn72pw8OUCleJxeKXhUJhkkgksorF4t9ycnL6MzMzndnZ2ZVyufxrjUbzPP9bk8n0a0LCjdPxzjafKzN+a4z5ApKvx3AMRT1D/ddls9lu3WHlHvbT6K2qhFhwZcRDxIAAQJD0wbXborgo+DE+Bv4JFF0RVsv+ZQluxkZpHg8UGcsEl0BPqEuFnlSCm+9G6S6Gekj+OSR/HF1KRaAE54EM38aCJSkObn31znwkYM6AhHFRQH8SDRnXY04LvnwrlYpgCRJjr5Z8/97rs8nvX40oCPW/qb8A7SmdDJ0asswAAAAASUVORK5CYII="
                    />
                  </button>
                  <button type="button" onClick={() => { setOpenInbox(true); }}>
                    <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${!openInbox ? "" : "activeTab"}`}>
                      Inbox
                    </h1>
                  </button>
                </div>
              )}
              { showAddGoal && (<AddGoalForm />)}
              <div>
                {userGoals?.map((goal: GoalItem) => (
                  showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm />
                    : (
                      <MyGoal
                        goal={goal}
                        showActions={showActions}
                        setShowActions={setShowActions}
                      />
                    )
                ))}
              </div>
            </div>
          )
            :
            (<GoalSublist />)
        }
        { showChangesModal && <DisplayChangesModal /> }
      </div>
    </>
  );
};
