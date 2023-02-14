import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState, displayLoader, displayToast, lastAction, searchActive } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
// import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
// import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import myGroupsIcon from "@assets/images/myGroupsIconLight.svg";
import myTimeIcon from "@assets/images/myTimeIconLight.svg";
import myGoalsIcon from "@assets/images/myGoalsIconLight.svg";
import myFeelingsIcon from "@assets/images/myFeelingsIconLight.svg";

import myGroupsIconFilledLight from "@assets/images/myGroupsIconFilledLight.svg";
import myTimeIconFilledLight from "@assets/images/myTimeIconFilledLight.svg";
import myGoalsIconFilledLight from "@assets/images/myGoalsIconFilledLight.svg";
import myFeelingsIconFilledLight from "@assets/images/myFeelingsIconFilledLight.svg";

import myGroupsIconFilledDark from "@assets/images/myGroupsIconFilledDark.svg";
import myTimeIconFilledDark from "@assets/images/myTimeIconFilledDark.svg";
import myGoalsIconFilledDark from "@assets/images/myGoalsIconFilledDark.svg";
import myFeelingsIconFilledDark from "@assets/images/myFeelingsIconFilledDark.svg";

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

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();
  const currentPage = window.location.pathname.split("/")[1];
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

  const getNavIcon = (imageVariable: string, to = "", customStyle = {}) => {
    const pageName = to === "My Time" && currentPage === "" ? "" : to.split(" ").join("");
    const imgCustomClass = `nav-icon${darkModeStatus ? "-dark" : ""}${pageName === currentPage ? "-filled" : ""}`;
    console.log(to === "Sidebar", imgCustomClass);
    return (
      <button
        type="button"
        className={`nav-icon ${to === "Sidebar" ? "" : imgCustomClass}`}
        onClick={() => { handleNavClick(to); }}
      >
        <img alt={to} style={customStyle} src={imageVariable} />
      </button>
    );
  };
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
      {getNavIcon(
        (currentPage !== "" ? myTimeIcon :
          darkModeStatus ? myTimeIconFilledDark : myTimeIconFilledLight),
        "My Time",
        { paddingTop: "4px" })}
      {getNavIcon(
        (currentPage !== "MyGroups" ? myGroupsIcon :
          darkModeStatus ? myGroupsIconFilledDark : myGroupsIconFilledLight),
        "My Groups",
        { paddingTop: "4px" })}
      { showBack ? getNavIcon(darkModeStatus ? mainAvatarDark : mainAvatarLight, "Sidebar")
        : getNavIcon(ArrowIcon, "Back")}
      {getNavIcon(
        (currentPage !== "MyFeelings" ? myFeelingsIcon :
          darkModeStatus ? myFeelingsIconFilledDark : myFeelingsIconFilledLight),
        "My Feelings")}
      {currentPage !== "/MyGoals" ?
        getNavIcon((currentPage !== "MyGoals" ? myGoalsIcon :
          darkModeStatus ? myGoalsIconFilledDark : myGoalsIconFilledLight), "My Goals", { paddingTop: "4px" }) :
        getNavIcon(!showAddGoal && !showUpdateGoal ? (darkModeStatus ? addDark : addLight) : (darkModeStatus ? correctDark : correctLight), "save action", { width: "30px" })}
      <Sidebar />
      <SuggestionModal goalID={goalID} />
    </div>

  );
};
