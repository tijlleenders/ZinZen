/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState, displayToast, lastAction } from "@store";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import myTimeIcon from "@assets/images/myTimeIconLight.svg";
import myGoalsIcon from "@assets/images/myGoalsIconLight.svg";
import myFeelingsIcon from "@assets/images/myFeelingsIconLight.svg";

import myTimeIconFilledLight from "@assets/images/myTimeIconFilledLight.svg";
import myGoalsIconFilledLight from "@assets/images/myGoalsIconFilledLight.svg";
import myFeelingsIconFilledLight from "@assets/images/myFeelingsIconFilledLight.svg";

import myTimeIconFilledDark from "@assets/images/myTimeIconFilledDark.svg";
import myGoalsIconFilledDark from "@assets/images/myGoalsIconFilledDark.svg";
import myFeelingsIconFilledDark from "@assets/images/myFeelingsIconFilledDark.svg";

import addLight from "@assets/images/addLight.svg";
import addDark from "@assets/images/addDark.svg";
import correctLight from "@assets/images/correctLight.svg";
import correctDark from "@assets/images/correctDark.svg";

import Sidebar from "@components/Sidebar";
import { colorPalleteList } from "@src/utils";
import { displaySidebar } from "@src/store/SidebarState";
import { createUserGroup } from "@src/helpers/GroupsProcessor";
import { areGoalTagsValid } from "@src/validators/GoalValidators";
import { createGoal, modifyGoal } from "@src/helpers/GoalController";
import SuggestionModal from "@components/GoalsComponents/SuggestionModal/SuggestionModal";
import { displayAddPublicGroup, displayExploreGroups, newGroupTitle } from "@src/store/GroupsState";
import { inputGoalTags, extractedTitle, displayAddGoal, displayGoalId, displayUpdateGoal, selectedColorIndex, goalsHistory } from "@src/store/GoalsState";

import "@translations/i18n";
import "./HeaderDashboard.scss";
import { getGoal } from "@src/api/GoalsAPI";

export const PageHighlighter = () => {
  const [selected, setSelected] = useState(0);
  const darkModeStatus = useRecoilValue(darkModeState);
  useEffect(() => {
    const currentPage = window.location.pathname.split("/")[1];
    if (currentPage === "") {
      setSelected(1);
    } else if (currentPage === "MyGoals") {
      setSelected(2);
    } else if (currentPage === "MyFeelings") {
      setSelected(4);
    } else {
      setSelected(0);
    }
  }, []);
  return (
    <div
      style={{
        display: selected ? "hidden" : "block",
        background: darkModeStatus ? "#705BBC" : "#CD6E51",
        height: "3px",
        width: "20vw",
        maxWidth: "120px",
        borderRadius: "50%",
        position: "absolute",
        bottom: "0",
        left: `${(selected - 1) * 20}%`,
      }}
    />
  );
};

export const MainHeaderDashboard = () => {
  const navigate = useNavigate();

  const currentPage = window.location.pathname.split("/")[1];
  const goalID = useRecoilValue(displayGoalId);
  const colorIndex = useRecoilValue(selectedColorIndex);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalsHistory = useRecoilValue(goalsHistory);

  const [action, setLastAction] = useRecoilState(lastAction);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [showSidebar, setShowSidebar] = useRecoilState(displaySidebar);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [newGroupName, setNewGroupName] = useRecoilState(newGroupTitle);
  const [openAddGroup, setOpenAddGroup] = useRecoilState(displayAddPublicGroup);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const setShowToast = useSetRecoilState(displayToast);
  const setColorIndex = useSetRecoilState(selectedColorIndex);
  const setOpenExploreGroups = useSetRecoilState(displayExploreGroups);

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
    const { valid, reason } = areGoalTagsValid(goalTags);
    if (!valid) { setShowToast({ open: true, message: reason, extra: "" }); return; }
    const { parentGoal } = await createGoal(showAddGoal.goalId, goalTags, goalTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) { addInHistory(parentGoal); }
    if (!parentGoal && goalTitle === "magic") { setShowToast({ open: true, message: "Congratulations, you activated DEV mode", extra: "Explore what's hidden" }); }
    resetCurrentStates();
  };
  const updateThisGoal = async () => {
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    const { valid, reason } = areGoalTagsValid(goalTags);
    if (!valid) { setShowToast({ open: true, message: reason, extra: "" }); return; }
    await modifyGoal(showUpdateGoal.goalId, goalTags, goalTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
    resetCurrentStates();
  };
  const addThisGroup = async () => {
    if (newGroupName.trim() === "") {
      setShowToast({ open: true, message: "Group cannot be created without name", extra: "" });
    } else {
      await createUserGroup(newGroupName);
      setOpenAddGroup(false);
      setNewGroupName("");
      setLastAction("groupAdded");
    }
  };
  const handleNavClick = async (to: string) => {
    if (to === "Zinzen") {
      setDarkModeStatus(!darkModeStatus);
      localStorage.setItem("theme", darkModeStatus ? "dark" : "light");
    } else if (to === "Menu") {
      setShowSidebar(!showSidebar);
    } else if (to === "My Goals") {
      navigate("/MyGoals");
    } else if (to === "My Time") {
      navigate("/");
    } else if (to === "My Feelings") {
      navigate("/MyFeelings");
    } else if (to === "My Groups") {
      navigate("/MyGroups");
    } else if (to === "save action") {
      if (currentPage === "MyGroups") {
        if (openAddGroup) {
          setLastAction("addGroup");
        } else { setOpenAddGroup(true); setOpenExploreGroups(false); }
      } else if (!showAddGoal && !showUpdateGoal) {
        if (selectedGoalId === "root") { setColorIndex(Math.floor((Math.random() * colorPalleteList.length) + 1)); }
        else { await getGoal(selectedGoalId).then((goal) => setColorIndex(colorPalleteList.indexOf(goal.goalColor))); }
        setShowAddGoal({ open: true, goalId: selectedGoalId });
        if (currentPage !== "MyGoals") { navigate("/MyGoals"); }
      } else if (showAddGoal) {
        setLastAction("addGoal");
      } else if (showUpdateGoal) {
        setLastAction("updateGoal");
      }
    }
    if (to !== "save action") {
      if (showAddGoal) { setShowAddGoal(null); } else if (showUpdateGoal) { setShowUpdateGoal(null); } else if (openAddGroup) { setOpenAddGroup(false); }
    }
  };

  const getNavIcon = (imageVariable: string, to = "", customStyle = {}) => {
    const pageName = to === "My Time" && currentPage === "" ? "" : to.split(" ").join("");
    const imgCustomClass = `nav-icon${darkModeStatus ? "-dark" : ""}${pageName === currentPage ? "-filled" : ""}`;
    return (
      <button
        type="button"
        className={`nav-icon ${to === "Menu" ? "" : imgCustomClass}`}
        onClick={() => { handleNavClick(to); }}
      >
        <img alt={to} style={customStyle} src={imageVariable} />
        <p style={{ color: !darkModeStatus ? "#CD6E51" : "#705BBC" }} className={pageName === currentPage ? "selected" : ""}>{
          to === "save action" ? (!showAddGoal && !showUpdateGoal && !openAddGroup)
            ? "Add" : "Save" : (to.includes("My") ? to.split(" ")[1] : to)
          }
        </p>
      </button>
    );
  };

  useEffect(() => {
    if (action === "addGroup") {
      addThisGroup();
    } else if (action === "addGoal") {
      addThisGoal();
    } else if (action === "updateGoal") {
      updateThisGoal();
    } else if (action === "none") {
      setLastAction("none");
    }
  }, [action]);
  return (
    <div className={`positioning${!darkModeStatus ? "-light" : "-dark"}`} style={{ height: "5em" }}>
      <div className="nav-layer">
        {getNavIcon(
          (currentPage !== "" ? myTimeIcon :
            darkModeStatus ? myTimeIconFilledDark : myTimeIconFilledLight),
          "My Time",
          { paddingTop: "4px", width: "32px" })}
        {getNavIcon((currentPage !== "MyGoals" ? myGoalsIcon :
          darkModeStatus ? myGoalsIconFilledDark : myGoalsIconFilledLight), "My Goals", { paddingTop: "4px" })}
        {getNavIcon(darkModeStatus ? mainAvatarDark : mainAvatarLight, "Menu")}

        <div className={showSidebar ? "overlay" : ""} onClick={() => setShowSidebar(false)}>
          {showSidebar && (<Sidebar />)}
        </div>
        {getNavIcon(
          (currentPage !== "MyFeelings" ? myFeelingsIcon :
            darkModeStatus ? myFeelingsIconFilledDark : myFeelingsIconFilledLight),
          "My Feelings")}
        {getNavIcon(!showAddGoal && !showUpdateGoal && !openAddGroup ?
          (darkModeStatus ? addDark : addLight)
          : (darkModeStatus ? correctDark : correctLight),
        "save action",
        { width: "30px" })}
        { currentPage !== "MyGroups" && <PageHighlighter /> }
        <div />
      </div>
      <SuggestionModal goalID={goalID} />
    </div>

  );
};
