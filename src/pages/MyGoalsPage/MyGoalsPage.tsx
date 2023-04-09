/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-await-in-loop */
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import publicGoals from "@assets/images/publicGoals.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";

import Search from "@src/common/Search";
import Loader from "@src/common/Loader";
import { GoalItem } from "@src/models/GoalItem";
import { getActiveGoals, getGoal } from "@api/GoalsAPI";
import { ILocationProps } from "@src/Interfaces/IPages";
import { getPublicGoals } from "@src/services/goal.service";
import {
  displayAddGoal,
  displayChangesModal,
  displayGoalId,
  displayShareModal,
  displaySuggestionsModal,
  displayUpdateGoal,
  goalsHistory,
  popFromGoalsHistory } from "@src/store/GoalsState";
import { getAllContacts } from "@src/api/ContactsAPI";
import MyGoal from "@components/GoalsComponents/MyGoal";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import GoalConfigModal from "@components/GoalsComponents/GoalConfigModal/GoalConfigModal";
import { GoalSublist } from "@components/GoalsComponents/GoalSublistPage/GoalSublistPage";
import ArchivedAccordion from "@components/GoalsComponents/ArchivedAccordion/ArchivedAccordion";
import { darkModeState, displayInbox, displayToast, lastAction, searchActive } from "@src/store";
import DisplayChangesModal from "@components/GoalsComponents/DisplayChangesModal/DisplayChangesModal";

import "./MyGoalsPage.scss";
import * as serviceWorkerRegistration from "../../service-worker/serviceWorkerRegistration";

export const MyGoalsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isUpdgradeAvailable = localStorage.getItem("updateAvailable") === "true";
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState({ P: true });
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });
  const showAddGoal = useRecoilValue(displayAddGoal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);

  const setShowToast = useSetRecoilState(displayToast);
  const setShowSuggestionsModal = useSetRecoilState(displaySuggestionsModal);

  const setSubGoalHistory = useSetRecoilState(goalsHistory);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [openInbox, setOpenInbox] = useRecoilState(displayInbox);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals("true");
    handleUserGoals(goals);
  };
  const search = async (text: string) => {
    const goals: GoalItem[] = openInbox ? await getActiveSharedWMGoals() : await getActiveGoals("true");
    handleUserGoals(goals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) { clearTimeout(debounceTimeout); }
    debounceTimeout = setTimeout(() => { search(event.target.value); }, 300);
  };

  const handleBackClick = () => {
    if (!showAddGoal && !showUpdateGoal) {
      navigate(-1);
    } else { popFromHistory(-1); }
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
      <MainHeaderDashboard />
      <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {
          selectedGoalId === "root" ? (
            <div className="my-goals-content">
              { displaySearch && <Search debounceSearch={debounceSearch} />}
              { !displaySearch && (
              <div className="sec-header">
                { showAddGoal || showUpdateGoal ? (
                  <button
                    type="button"
                    className="back nav-icon"
                    style={{ marginTop: "6px" }}
                    onClick={() => { handleBackClick(); }}
                  >
                    <img alt="zinzen my goals" src={ArrowIcon} />
                  </button>
                ) : (
                  <button type="button" onClick={() => { setOpenInbox(false); }}>
                    <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${openInbox ? "" : "activeTab"}`}>
                      { t("mygoals") }
                    </h1>
                  </button>
                )}
                <button
                  type="button"
                  style={{ borderRadius: "50%" }}
                  className={`publicGoal ${showAddGoal ? `${darkModeStatus ? "dark" : "light"}-svg-bg` : ""}`}
                  onClick={async () => {
                    if (showAddGoal) {
                      setLoading(true);
                      const res = await getPublicGoals(selectedGoalId === "root" ? "root" : (await getGoal(selectedGoalId)).title);
                      if (res.status && res.data?.length > 0) {
                        const tmpPG = [...res.data];
                        setEmpty({ ...empty, P: tmpPG.length === 0 });
                        setShowSuggestionsModal({ selected: "Public", goals: [...tmpPG] });
                      } else {
                        setShowToast({ open: true, message: "Awww... no hints today. We'll keep looking!", extra: "" });
                      }
                      setLoading(false);
                    } else { setDisplaySearch(true); }
                  }}
                >
                  <img
                    alt="search goal"
                    className={showAddGoal && darkModeStatus ? "dark-svg" : ""}
                    style={{ width: "35px", marginTop: "10px", height: "30px", ...(!showAddGoal && darkModeStatus ? { filter: "invert(1)" } : {}) }}
                    src={showAddGoal ? publicGoals : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEiElEQVR4nO2WWUhjVxjHb0ppC31oaQvzVJzqQKGFUltsC+3UvpT2rYU+1IGOUig+mGjcTW6W660YZcqMWVpFx5ukhiRqxiUoopAxNe4bcauJqRvquC9xi8Zx+pXv0CtWBqaQTEPBDw4n5yZwfvf//3/nhKIuKzwlyMvLe4mKVBUXF3/Esmwpy7LDhYWF3qKioqmCggKvUqnso2m6SCKRXHvqEHa7/QrHcfc0Gs0flZWVgerqamhoaAC73U5ms9kMFRUVuyqVyiOVSjUMw7zwVECCweDb3d3dbr1ef9jY2AhdXV0wMzMDa2trsLOzAysrK+D1esHpdEJdXR2UlpZu0jTdwTDMa2EFcTgcVwYHB91VVVUnbW1tZNONjQ3Y29uDQCAAR0dHcHh4CLu7u7C+vg5jY2PQ3NyMKu3TNH2fYZjnwgZjMpnu6fX6AwSZmJggG/r9fgKAIMfHx2Q+ODg4U8ntdkNTUxPodLoVmqYVYQFRqVQfarVaH1ozMDAACwsLsL29TTZGVRCEHwi0v78Pm5ubMDs7C729vVBTUwMsy3okEsmrIcPIZLJfOI47bG9vh8nJSVheXj6zJxgMknFyckIGfka1ULWlpSUYHx8HVPNvdX4IGUYqlQ5ZrVbo6+sjb4sWYTZQiYsgvDr4/erqKvh8Pujs7ASj0fiQpmlbqCwChULhxbYdHh6G+fl5YgFawVvEw+DANR9kDDjC9/f3Ax4BSqWyKySSrKysFxUKxRTmxe12n+XlPAyvznll0EaEmZubIznD3OTn5w+GqgxF0/RkfX09DA0NPVYZPjd8iPE53+KoDNprsVhAoVA4Q4ZJT0/vMZvNf2JnTE9Pk0PuYluf76bz7T01NQUulwsMBsOxUqk0hAwjFAoLysvL/Q6Hg5wxi4uLsLW1RazAjREK1cCBaz4vaOno6Ci0tLSAVqtdYFn2m5BhRCLRGzKZzGOz2Yjk2CHYtmgXKoRQOBACFUEQBPZ4PKSTLBbLI7VaPRK2eyolJeW2VqtdxyMeA4lA+OZoBUIhAGYE1/gcQdBW7EKO4/x373LfUeEqvFtSU1OdZWVlewjU09NDDjSEwssSuwZnzMjIyAhRBEHwwsTQa7Q/l1MUCMIGlJGR8UpaWlprSUnJA2xVPFkxnGgdqoVzR0cHyYjZbH5kNBr9Vms1sQzD3dLaWndHrdOEDYphmGdFIlFubm7u72q1+oHBYHiIbYtw+F9Gr9cfY1h1Ot2IyWS6UVtb+1NiYhKxLhAInG77hr3Jn72pw8OUCleJxeKXhUJhkkgksorF4t9ycnL6MzMzndnZ2ZVyufxrjUbzPP9bk8n0a0LCjdPxzjafKzN+a4z5ApKvx3AMRT1D/ddls9lu3WHlHvbT6K2qhFhwZcRDxIAAQJD0wbXborgo+DE+Bv4JFF0RVsv+ZQluxkZpHg8UGcsEl0BPqEuFnlSCm+9G6S6Gekj+OSR/HF1KRaAE54EM38aCJSkObn31znwkYM6AhHFRQH8SDRnXY04LvnwrlYpgCRJjr5Z8/97rs8nvX40oCPW/qb8A7SmdDJ0asswAAAAASUVORK5CYII="}
                  />
                  { loading && <Loader /> }
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!isUpdgradeAvailable && (await getActiveSharedWMGoals()).length === 0) {
                      if ((await getAllContacts()).length === 0) {
                        setShowToast({ open: true, message: "Your Inbox is empty.", extra: "Make some friends so that they can share their goals with you too😊" });
                      } else {
                        setShowToast({ open: true, message: "Your Inbox is empty.", extra: "Your current friends haven't shared any of their goals with you" });
                      }
                    } else { setOpenInbox(true); }
                  }}
                >
                  <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${!openInbox ? "" : "activeTab"}`}>
                    Inbox
                  </h1>
                </button>
              </div>
              )}
              { showAddGoal && (<GoalConfigModal goal={createGoalObjectFromTags({})} />)}
              <div>
                { openInbox && isUpdgradeAvailable && (
                  <ArchivedAccordion name="Notifications" totalItems={1}>
                    <div className={`notification-item user-goal${darkModeStatus ? "-dark" : ""}`}>
                      <p>Upgrade Available !!</p>
                      <button
                        type="button"
                        onClick={async () => {
                          navigator.serviceWorker.register("../../service-worker.js")
                            .then((registration) => {
                              if (registration.waiting) {
                                registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                                localStorage.setItem("updateAvailable", "false");
                                window.location.reload();
                              }
                            });
                        }}
                        className={`default-btn${darkModeStatus ? "-dark" : ""}`}
                      >Upgrade Now
                      </button>
                    </div>
                  </ArchivedAccordion>
                )}
                {activeGoals.map((goal: GoalItem) => (
                  <>
                    { showUpdateGoal?.goalId === goal.id && <GoalConfigModal goal={goal} /> }
                    <MyGoal
                      goal={goal}
                      showActions={showActions}
                      setShowActions={setShowActions}
                    />
                  </>
                ))}
                { archivedGoals.length > 0 && (
                  <ArchivedAccordion name="Archived" totalItems={archivedGoals.length}>
                    {archivedGoals.map((goal: GoalItem) => (
                      <MyGoal
                        key={`goal-${goal.id}`}
                        goal={goal}
                        showActions={showActions}
                        setShowActions={setShowActions}
                      />
                    ))}
                  </ArchivedAccordion>
                )}
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
