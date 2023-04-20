import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import { GoalItem } from "@src/models/GoalItem";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { darkModeState, lastAction, searchActive } from "@src/store";
import { getHistoryUptoGoal, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { displayGoalId, addInGoalsHistory, displayUpdateGoal, displayShareModal, goalsHistory, displayChangesModal } from "@src/store/GoalsState";
import MyGoalActions from "./MyGoalActions";
import ShareGoalModal from "./ShareGoalModal/ShareGoalModal";

interface MyGoalProps {
    goal: GoalItem,
    showActions: {
      open: string;
      click: number;
  },
  setShowActions: React.Dispatch<React.SetStateAction<{
    open: string;
    click: number;
  }>>
}

const MyGoal: React.FC<MyGoalProps> = ({ goal, showActions, setShowActions }) => {
  const defaultTap = { open: "root", click: 1 };
  const archived = goal.archived === "true";
  const sharedWithContact = goal.shared.contacts.length > 0 ? goal.shared.contacts[0].name : null;
  const collabWithContact = goal.collaboration.collaborators.length > 0 ? goal.collaboration.collaborators[0].name : null;

  const darkModeStatus = useRecoilValue(darkModeState);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);

  const setLastAction = useSetRecoilState(lastAction);
  const setSubGoalHistory = useSetRecoilState(goalsHistory);
  const addInHistory = useSetRecoilState(addInGoalsHistory);

  const handleGoalClick = () => {
    if (goal.sublist.length === 0) {
      if (showActions.open === goal.id && showActions.click > 0) {
        setShowActions(defaultTap);
      } else { setShowActions({ open: goal.id, click: 1 }); }
    } else {
      if (displaySearch) setDisplaySearch(false);
      // @ts-ignore
      addInHistory(goal);
    }
  };
  async function handleDropDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    if (archived) { return; }
    if (showActions.open === goal.id && showActions.click > 0) {
      setShowActions(defaultTap);
    } else if ((goal.collaboration.newUpdates && goal.typeOfGoal === "collaboration") || goal.shared.conversionRequests.status) {
      if (goal.shared.conversionRequests.status) {
        setShowChangesModal({ typeAtPriority: "conversionRequest", parentId: goal.id, goals: [] });
      } else {
        const res = await jumpToLowestChanges(goal.rootGoalId);
        const pathToGoal = (await getHistoryUptoGoal(res.parentId));
        if (pathToGoal.length > 1) {
          pathToGoal.pop();
          setSubGoalHistory([...pathToGoal]);
          setSelectedGoalId(pathToGoal.slice(-1)[0].goalID);
        }
        setShowChangesModal(res);
      }
    } else setShowActions({ open: goal.id, click: 1 });
  }
  useEffect(() => {
    if (showActions !== defaultTap) {
      setShowActions(defaultTap);
    }
  }, [showChangesModal, showUpdateGoal, selectedGoalId]);
  return (
    <div
      key={String(`goal-${goal.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""}`}
    >
      <div
        className="goal-dropdown"
        onClickCapture={(e) => { handleDropDown(e); }}
      >
        { (
          goal.collaboration.newUpdates || goal.shared.conversionRequests.status
        ) && <NotificationSymbol color={goal.goalColor} /> }
        { goal.sublist.length > 0 && (
          <div
            className="goal-dd-outer"
            style={{ borderColor: goal.goalColor }}
          />
        )}
        <div
          className="goal-dd-inner"
          style={{
            height: showActions.open === goal.id && showActions.click > 0 ? "75%" : "65%",
            background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`
          }}
        />
      </div>
      <div
        className="user-goal-main"
        onClickCapture={() => { handleGoalClick(); }}
        style={{
          ...(showActions.open === goal.id) ? { paddingBottom: 0 } : {},
          ...(goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root" ? { width: "80%" } : {})
        }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{goal.title}</div>&nbsp;
          { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
        </div>
      </div>

      { (goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root") && (
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={<Tooltip id="tooltip-disabled"> {sharedWithContact || collabWithContact } </Tooltip>}
      >
        <div
          className="contact-button"
          style={archived ? { right: "78px" } : {}}
        >
          { goal.typeOfGoal === "collaboration" && (
          <img
            alt="collaborate goal"
            src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
            style={{ width: "27px", position: "absolute", right: "18px" }}
          />
          ) }
          <button
            type="button"
            className="contact-icon"
            style={{ width: "15px", background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)` }}
          >
            {sharedWithContact?.charAt(0) || collabWithContact?.charAt(0) || "" }
          </button>
        </div>

      </OverlayTrigger>
      )}
      { archived && (
      <button
        type="button"
        className="contact-icon"
        style={{
          width: "35px",
          height: "45px",
          position: "absolute",
          right: "18px",
          top: "5px",
          ...(darkModeStatus ? {
            background: "transparent",
            filter: "invert(1)" } : {}) }}
        onClickCapture={async () => { await unarchiveUserGoal(goal); setLastAction("unarchived"); }}
      >
        <img alt="archived goal" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4ElEQVR4nGNgIAmwWEAwbYA8KyvHOxAGsaltOAcLK8cNE+uwP2a2EX9ZWDluMzAwcBKrOZqBgeEMDjwFpICFjXO5srrl1+C4zv8grKxu+Z2VlWMdVP9UPPqjQAo6GRgYyhkYGJSwYBEmJpYsfgHJT4ExbWDDQTgotv2/gJDMJyYWliyQGhx6y6Fmg4kkHL4zY2Pn+uwdUg03HIZ9wmr/s7Fzf2JgYLDGoTeJkAViLCxsr62dEv/7RjSAXQ0zHOQbkBhIjoWV/TVILRkWMEWysLK/AhnAzML6UVHVDB4HIDZIDCQHUgNSS44PkIG/jIL+B5gFIDZIjICeUQsYRoOISqmIiZFxExc7y0tBHo67yJiLnTURSbEXCwvbN25e4XcgDGIzMDB4wiRBajH1s7xkYmTcyMDLxTatKtzk/8kJ4XC8tz3oPz8X20cGBgZlqBlMDAwMikjljCJUDASU+bnZPoL0IJsBMhNkNsiCSf1pdv9fLEtBwdOyHf7xc7FfQjIIG2Di42Y7Nz3b8S+6fpCZILNxWgDCPuaKnzjYWL7jwyA12PQSZQElmCgLpuc4/vc1V8SLQWrItuDKjOj/u1oD8OKrM2IIWxBmq/q/O8WGqhhkJtgCFhYGax4O1gm0wCCzAT7lGEfIoQ9QAAAAAElFTkSuQmCC" />
      </button>
      )}
      { showActions.open === goal.id && showActions.click > 0 && !archived && (
        <MyGoalActions
          goal={goal}
          setShowShareModal={setShowShareModal}
          setShowUpdateGoal={setShowUpdateGoal}
        />
      )}
      {showShareModal === goal.id && (
        <ShareGoalModal
          goal={goal}
          showShareModal={showShareModal}
          setShowShareModal={setShowShareModal}
        />
      )}
    </div>
  );
};

export default MyGoal;
