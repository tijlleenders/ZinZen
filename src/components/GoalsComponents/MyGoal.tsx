import { Tooltip } from "antd";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { unarchiveIcon } from "@src/assets";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import { GoalItem } from "@src/models/GoalItem";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { darkModeState, lastAction, searchActive } from "@src/store";
import { createSentFromTags, getHistoryUptoGoal, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { displayGoalId, addInGoalsHistory, displayUpdateGoal, displayShareModal, goalsHistory, displayChangesModal } from "@src/store/GoalsState";
import { useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);

  const setLastAction = useSetRecoilState(lastAction);
  const addInHistory = useSetRecoilState(addInGoalsHistory);

  const handleGoalClick = () => {
    if (goal.sublist.length === 0) {
      if (showActions.open === goal.id && showActions.click > 0) {
        setShowActions(defaultTap);
      } else { setShowActions({ open: goal.id, click: 1 }); }
    } else {
      if (displaySearch) setDisplaySearch(false);
      // @ts-ignore
      navigate("/MyGoals", { state: {
        activeGoalId: goal.id,
        goalsHistory: [...subGoalHistory, {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        }] }
      });
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
            style={{ height: showActions.open === goal.id && showActions.click > 0 ? "calc(100% - 50px)" : 54, borderColor: goal.goalColor, top: showActions.open === goal.id ? 11.5 : 10 }}
          />
        )}
        <div
          className="goal-dd-inner"
          style={{
            height: showActions.open === goal.id && showActions.click > 0 ? archived ? "calc(100% - 20px)" : 90 : 44,
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
          <div>
            {goal.title}&nbsp;{ goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
            { showActions.open === goal.id && showActions.click > 0 && <p className="goal-desc">{createSentFromTags(goal)}</p>}
          </div>
        </div>
      </div>

      { (goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root") && (
      <Tooltip placement="top" title={sharedWithContact || collabWithContact}>
        <div
          className="contact-button"
          style={archived ? { right: "78px" } : {}}
        >
          { goal.typeOfGoal === "collaboration" && (
          <img
            alt="collaborate goal"
            width={25}
            src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
            style={{ position: "absolute", right: "18px" }}
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

      </Tooltip>
      )}
      { archived && (
      <div className="contact-button">
        <button
          type="button"
          className="contact-icon"
          style={{ padding: 0, background: "transparent", filter: darkModeStatus ? "invert(1)" : "none" }}
          onClickCapture={async () => { await unarchiveUserGoal(goal); setLastAction("unarchived"); }}
        >
          <img alt="archived goal" src={unarchiveIcon} style={{ width: 18, height: 18 }} />
        </button>
      </div>
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
