import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState, displayLoader, displayToast, lastAction } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
// import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
// import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import myTimeIcon from "@assets/images/myTimeIcon.svg";
import myGoalsIcon from "@assets/images/myGoalsIcon.svg";
import myFeelingsIcon from "@assets/images/myFeelingsIcon.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";
import addLight from "@assets/images/addLight.svg";
import addDark from "@assets/images/addDark.svg";
import correctLight from "@assets/images/correctLight.svg";
import correctDark from "@assets/images/correctDark.svg";

import Sidebar from "@components/Sidebar";
import { displaySidebar } from "@src/store/SidebarState";
import { inputGoalTags, extractedTitle, displayAddGoal, displayGoalId, displayUpdateGoal, selectedColorIndex, goalsHistory, popFromGoalsHistory, displayAddGoalOptions } from "@src/store/GoalsState";
import { createGoal, modifyGoal } from "@src/helpers/GoalController";
import { colorPalleteList } from "@src/utils";

import "@translations/i18n";
import "./HeaderDashboard.scss";
import SuggestionModal from "@components/GoalsComponents/SuggestionModal/SuggestionModal";
import Loader from "@src/common/Loader";

// const zinzenLogoStyle = {
//   width: "110px",
//   paddingBottom: "6px"
// };

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const goalID = useRecoilValue(displayGoalId);
  const showLoader = useRecoilValue(displayLoader);
  const colorIndex = useRecoilValue(selectedColorIndex);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalsHistory = useRecoilValue(goalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [showSidebar, setShowSidebar] = useRecoilState(displaySidebar);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);
  const setShowToast = useSetRecoilState(displayToast);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  const isTitleEmpty = () => {
    if (goalTitle.length === 0) { setShowToast({ open: true, message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`, extra: "" }); }
    return goalTitle.length === 0;
  };

  const resetCurrentStates = () => {
    if (showAddGoal) { setShowAddGoal(null); } else if (showUpdateGoal) { setShowUpdateGoal(null); }
    // @ts-ignore
    setGoalTags({});
    setGoalTitle("");
  };
  const addThisGoal = async () => {
    if (!showAddGoal || isTitleEmpty()) { return; }
    const { parentGoal } = await createGoal(showAddGoal.goalId, goalTags, goalTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) { addInHistory(parentGoal); }
    if (!parentGoal && goalTitle === "magic") { setShowToast({ open: true, message: "Congratulations, you activated DEV mode", extra: "Explore what's hidden" }); }
    resetCurrentStates();
  };
  const updateThisGoal = async () => {
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    await modifyGoal(showUpdateGoal.goalId, goalTags, goalTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
    resetCurrentStates();
  };

  const handleNavClick = async (to: string) => {
    if (to === "Zinzen") {
      setDarkModeStatus(!darkModeStatus);
      localStorage.setItem("theme", darkModeStatus ? "dark" : "light");
    } else if (to === "Sidebar") {
      setShowSidebar(!showSidebar);
    } else if (to === "My Goals") {
      navigate("/MyGoals");
    } else if (to === "My Time") {
      navigate("/");
    } else if (to === "My Feelings") {
      navigate("/MyFeelings");
    } else if (to === "Back") {
      if (!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0) {
        navigate(-1);
      } else popFromHistory(-1);
    } else if (to === "goal action") {
      if (!showAddGoal && !showUpdateGoal) {
        setShowAddGoalOptions(true);
      } else if (showAddGoal) {
        setLastAction("addGoal");
      } else if (showUpdateGoal) {
        setLastAction("updateGoal");
      }
    }
  };
  const getNavIcon = (imageVariable: string, to = "", customStyle = {}) => (
    <button
      type="button"
      className="nav-icon"
      onClick={() => { handleNavClick(to); }}
    >
      <img alt={to} style={customStyle} src={imageVariable} />
    </button>
  );
  useEffect(() => {
    if (action === "addGoal") {
      addThisGoal();
    } else if (action === "updateGoal") {
      updateThisGoal();
    } else if (action === "none") {
      setLastAction("none");
    }
  }, [action]);
  return (
    <div className={`positioning${!darkModeStatus ? "-light" : "-dark"}`}>
      { showLoader && <Loader /> }

      {!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0 ?
        getNavIcon(darkModeStatus ? mainAvatarDark : mainAvatarLight, "Sidebar")
        : getNavIcon(ArrowIcon, "Back")}
      {getNavIcon(myTimeIcon, "My Time", { paddingTop: "4px" })}
      {/* {getNavIcon(darkModeStatus ? ZinZenTextDark : ZinZenTextLight, "Zinzen", zinzenLogoStyle)} */}
      {getNavIcon(myFeelingsIcon, "My Feelings")}
      {
        window.location.pathname !== "/MyGoals" ?
          getNavIcon(myGoalsIcon, "My Goals", { paddingTop: "4px" }) :
          getNavIcon(!showAddGoal && !showUpdateGoal ? (darkModeStatus ? addDark : addLight) : (darkModeStatus ? correctDark : correctLight), "goal action", { width: "30px" })
      }
      <Sidebar />
      <SuggestionModal goalID={goalID} />
    </div>

  );
};
