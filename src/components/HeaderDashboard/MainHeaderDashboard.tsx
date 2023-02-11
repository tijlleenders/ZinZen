import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState, displayLoader, displayToast, lastAction, searchActive } from "@store";

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
import { displayAddPublicGroup, displayGroup, newGroupTitle } from "@src/store/GroupsState";
import { createUserGroup } from "@src/helpers/GroupsProcessor";

// const zinzenLogoStyle = {
//   width: "110px",
//   paddingBottom: "6px"
// };
const myGroupsIcon = "data:image/png;base64,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";

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
  const [openAddGroup, setOpenAddGroup] = useRecoilState(displayAddPublicGroup);
  const [selectedGroup, setSelectedGroup] = useRecoilState(displayGroup);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [newGroupName, setNewGroupName] = useRecoilState(newGroupTitle);

  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);
  const setShowToast = useSetRecoilState(displayToast);
  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  const showBack = !openAddGroup && !showAddGoal && !showUpdateGoal && !displaySearch && subGoalsHistory.length === 0 && !selectedGroup;

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
    } else if (to === "My Groups") {
      navigate("/MyGroups");
    } else if (to === "Back") {
      if (displaySearch) {
        setDisplaySearch(false);
      } else if (selectedGroup) {
        setSelectedGroup(null);
      } else if (openAddGroup) {
        setOpenAddGroup(false);
      } else if (!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0) {
        navigate(-1);
      } else popFromHistory(-1);
    } else if (to === "save action") {
      if (openAddGroup) {
        await createUserGroup(newGroupName);
        setNewGroupName("");
      } else if (!showAddGoal && !showUpdateGoal) {
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

      { showBack ? getNavIcon(darkModeStatus ? mainAvatarDark : mainAvatarLight, "Sidebar")
        : getNavIcon(ArrowIcon, "Back")}
      {getNavIcon(myTimeIcon, "My Time", { paddingTop: "4px" })}
      {getNavIcon(myGroupsIcon, "My Groups", { width: "45px", paddingTop: "4px" })}
      {/* {getNavIcon(darkModeStatus ? ZinZenTextDark : ZinZenTextLight, "Zinzen", zinzenLogoStyle)} */}
      {getNavIcon(myFeelingsIcon, "My Feelings")}
      {
        window.location.pathname !== "/MyGoals" ?
          getNavIcon(myGoalsIcon, "My Goals", { paddingTop: "4px" }) :
          getNavIcon(!showAddGoal && !showUpdateGoal ? (darkModeStatus ? addDark : addLight) : (darkModeStatus ? correctDark : correctLight), "save action", { width: "30px" })
      }
      <Sidebar />
      <SuggestionModal goalID={goalID} />
    </div>

  );
};
