import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import { darkModeState, searchActive } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { displayGoalId, addInGoalsHistory, displayUpdateGoal, displayShareModal, goalsHistory, displayChangesModal } from "@src/store/GoalsState";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { getHistoryUptoGoal, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
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
  const sharedWithContact = goal.shared.contacts.length > 0 ? goal.shared.contacts[0].name : null;
  const collabWithContact = goal.collaboration.collaborators.length > 0 ? goal.collaboration.collaborators[0].name : null;

  const darkModeStatus = useRecoilValue(darkModeState);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);

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
  async function handleDropDown() {
    if (showActions.open === goal.id && showActions.click > 0) {
      setShowActions(defaultTap);
    } else if ((goal.collaboration.newUpdates && goal.typeOfGoal === "collaboration") || goal.shared.conversionRequests.status) {
      if (goal.shared.conversionRequests.status) {
        setShowChangesModal({ typeAtPriority: "conversionRequest", parentId: goal.id, goals: [] });
      } else {
        const res = await jumpToLowestChanges(goal.rootGoalId);
        const pathToGoal = (await getHistoryUptoGoal(res.parentId));
        console.log(res, pathToGoal);
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
        onClickCapture={(e) => {
          e.stopPropagation();
          handleDropDown();
        }}
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
            height: showActions.open === goal.id && showActions.click > 0 ? "90%" : "80%",
            background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`
          }}
        />
      </div>
      <div
        className="user-goal-main"
        onClickCapture={() => { handleGoalClick(); }}
        style={{ ...(showActions.open === goal.id) ? { paddingBottom: 0 } : {} }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{goal.title}</div>&nbsp;
          { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
        </div>
        { (goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root") && (
          <OverlayTrigger
            trigger="click"
            placement="top"
            overlay={<Tooltip id="tooltip-disabled"> {sharedWithContact || collabWithContact } </Tooltip>}
          >
            <div
              className="contact-button"
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
                style={{ background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)` }}
              >
                {sharedWithContact?.charAt(0) || collabWithContact?.charAt(0) || "" }
              </button>
            </div>

          </OverlayTrigger>
        )}
      </div>
      { showActions.open === goal.id && showActions.click > 0 && (
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
