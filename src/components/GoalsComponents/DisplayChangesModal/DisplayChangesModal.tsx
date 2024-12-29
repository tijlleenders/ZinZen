/* eslint-disable consistent-return */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { darkModeState, lastAction } from "@src/store";
import { getAllContacts } from "@src/api/ContactsAPI";
import { typeOfChange, typeOfIntent } from "@src/models/InboxItem";
import { getGoal, updateGoal } from "@src/api/GoalsAPI";
import { deleteGoalChangesInID, getInboxItem, removeGoalInbox, removePPTFromInboxOfGoal } from "@src/api/InboxAPI";
import { findGoalTagChanges, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { getDeletedGoal } from "@src/api/TrashAPI";
import SubHeader from "@src/common/SubHeader";
import ContactItem from "@src/models/ContactItem";
import ZModal from "@src/common/ZModal";
import { getAllDescendants, getSharedRootGoal } from "@src/controllers/GoalController";
import {
  ArchivedStrategy,
  DeletedStrategy,
  ModifiedGoalsStrategy,
  MovedStrategy,
  RestoredStrategy,
  SubgoalsStrategy,
} from "@src/strategies/GoalChangeStrategies";
import { ChangeAcceptStrategyContext } from "@src/strategies/ChangeAcceptStrategyContext";
import { ChangeAcceptParams } from "@src/Interfaces/ChangeAccept";

import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";
import "./DisplayChangesModal.scss";
import { getMovedSubgoalsList } from "./ShowChanges";

const DisplayChangesModal = ({ currentMainGoal }: { currentMainGoal: GoalItem }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);
  const [updatesIntent, setUpdatesIntent] = useState<typeOfIntent>("shared");
  const [newGoals, setNewGoals] = useState<{ intent: typeOfIntent; goal: GoalItem }[]>([]);
  const [activePPT, setActivePPT] = useState(-1);
  const [updateList, setUpdateList] = useState<ITagsChanges>({ schemaVersion: {}, prettierVersion: {} });
  const [goalUnderReview, setGoalUnderReview] = useState<GoalItem>();
  const [participants, setParticipants] = useState<ContactItem[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none">("none");
  const [oldParentTitle, setOldParentTitle] = useState<string>("");
  const [newParentTitle, setNewParentTitle] = useState<string>("");
  const [moveGoalTitle, setMoveGoalTitle] = useState<string>("");
  useEffect(() => {
    const fetchParentTitles = async () => {
      if (!goalUnderReview) return;

      try {
        const currentGoalInDB = await getGoal(goalUnderReview.id);
        setMoveGoalTitle(currentGoalInDB?.title || "");
        const oldParentId = currentGoalInDB?.parentGoalId;

        const [oldParent, newParent] = await Promise.all([
          oldParentId ? getGoal(oldParentId) : null,
          getGoal(goalUnderReview.parentGoalId),
        ]);

        setOldParentTitle(oldParent?.title || "root");
        setNewParentTitle(newParent?.title || "Non-shared goal");
      } catch (error) {
        console.error("Error fetching parent titles:", error);
        setOldParentTitle("root");
        setNewParentTitle("Non-shared goal");
      }
    };

    fetchParentTitles();
  }, [goalUnderReview, newGoals]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unselectedChanges, setUnselectedChanges] = useState<string[]>([]);

  const getEditChangesList = () => {
    const { prettierVersion } = updateList;
    return (
      <div className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
        {Object.keys(prettierVersion).map((k) => {
          const { oldVal } = prettierVersion[k];
          const { newVal } = prettierVersion[k];
          return (
            <div key={`${k}-edit`}>
              <Checkbox
                checked={!unselectedChanges.includes(k)}
                className="checkbox"
                onChange={(e) => {
                  setUnselectedChanges([
                    ...(e.target.checked ? unselectedChanges.filter((tag) => tag !== k) : [...unselectedChanges, k]),
                  ]);
                }}
              />
              <p>
                &nbsp;{k}:&nbsp;
                <span className="existingChange">{oldVal}</span>&nbsp;
                <span className="incomingChange">{newVal}</span>
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const getSubgoalsList = () => {
    return (
      <div
        style={{
          background: "var(--secondary-background)",
          borderRadius: 8,
        }}
      >
        {newGoals.map(({ goal }) => (
          <div
            key={`${goal.id}-subgoal`}
            style={{
              padding: "22px 22px",
              border: "1px solid var(--default-border-color)",
              display: "flex",
            }}
          >
            <Checkbox
              checked={!unselectedChanges.includes(goal.id)}
              onChange={(e) => {
                setUnselectedChanges([
                  ...(e.target.checked
                    ? unselectedChanges.filter((id) => id !== goal.id)
                    : [...unselectedChanges, goal.id]),
                ]);
              }}
              className="checkbox"
            />
            <span style={{ marginLeft: 12 }}>{goal.title}</span>
          </div>
        ))}
      </div>
    );
  };

  const deleteChanges = async () => {
    if (!goalUnderReview || !currentMainGoal) {
      return;
    }
    const removeChanges =
      currentDisplay === "subgoals" || currentDisplay === "newGoalMoved"
        ? newGoals.map(({ goal }) => goal.id)
        : currentDisplay === "moved"
          ? [goalUnderReview.id, ...(await getAllDescendants(goalUnderReview.id)).map((goal: GoalItem) => goal.id)]
          : [goalUnderReview.id];

    if (currentDisplay !== "none") {
      await deleteGoalChangesInID(currentMainGoal.id, participants[activePPT].relId, currentDisplay, removeChanges);
    }
    setCurrentDisplay("none");
  };

  console.log("currentDisplay", participants[activePPT]);
  const acceptChanges = async () => {
    if (!goalUnderReview) {
      return;
    }

    const strategyContext = new ChangeAcceptStrategyContext();
    const params: ChangeAcceptParams = {
      goalUnderReview,
      newGoals,
      unselectedChanges,
      updateList,
      updatesIntent,
      participants,
      activePPT,
    };

    if (currentDisplay !== "none") {
      await deleteChanges();
    }
    switch (currentDisplay) {
      case "moved":
        strategyContext.setStrategy(new MovedStrategy());
        break;
      case "subgoals":
      case "newGoalMoved":
        strategyContext.setStrategy(new SubgoalsStrategy());
        break;
      case "modifiedGoals":
        strategyContext.setStrategy(new ModifiedGoalsStrategy());
        break;
      case "deleted":
        strategyContext.setStrategy(new DeletedStrategy());
        break;
      case "archived":
        strategyContext.setStrategy(new ArchivedStrategy());
        break;
      case "restored":
        strategyContext.setStrategy(new RestoredStrategy());
        break;
      default:
        return;
    }
    if (["subgoals", "newGoalMoved"].includes(currentDisplay)) {
      setUnselectedChanges([]);
      setNewGoals([]);
    } else if (currentDisplay === "modifiedGoals") {
      setUnselectedChanges([]);
      setUpdateList({ schemaVersion: {}, prettierVersion: {} });
    }
    await strategyContext.executeStrategy(params);
    setCurrentDisplay("none");
  };

  const getChanges = async () => {
    if (currentMainGoal && participants.length > 0 && activePPT >= 0) {
      const { typeAtPriority, goals, parentId } = await jumpToLowestChanges(
        currentMainGoal.id,
        participants[activePPT].relId,
      );
      console.log("🚀 ~ getChanges ~ goals:", goals, typeAtPriority, parentId);

      if (typeAtPriority === "none") {
        // remove participant from inbox
        if (participants.length === 1) {
          const rootGoal = await getSharedRootGoal(currentMainGoal.id, participants[activePPT].relId);
          if (rootGoal) {
            removeGoalInbox(rootGoal.id);
          }
          await Promise.allSettled([
            removeGoalInbox(currentMainGoal.id),
            updateGoal(currentMainGoal.id, { newUpdates: false }),
          ]);
          setLastAction("GoalChangesSynced");
          window.history.back();
          return;
        }
        await removePPTFromInboxOfGoal(currentMainGoal.id, participants[activePPT].relId);
        const currPPT = participants[activePPT].relId;
        setActivePPT(0);
        setParticipants([...participants.filter((ele) => ele.relId !== currPPT)]);
      } else if (typeAtPriority === "restored") {
        const goalToBeRestored = await getDeletedGoal(parentId);
        console.log("🚀 ~ getChanges ~ goalToBeRestored:", goalToBeRestored);
        if (goalToBeRestored) {
          delete goalToBeRestored.deletedAt;
          setGoalUnderReview(goalToBeRestored);
        }
      } else {
        const changedGoal = await getGoal(parentId);
        console.log("🚀 ~ getChanges ~ changedGoal:", changedGoal);
        if (changedGoal) {
          setGoalUnderReview({ ...changedGoal });
          if (typeAtPriority === "subgoals" || typeAtPriority === "newGoalMoved") {
            setNewGoals(goals || []);
          } else if (typeAtPriority === "moved") {
            setUpdatesIntent(goals[0].intent);
            setGoalUnderReview({ ...goals[0].goal });
          } else if (typeAtPriority === "modifiedGoals") {
            setUpdatesIntent(goals[0].intent);
            const incGoal: GoalItem = { ...goals[0].goal };
            setUpdateList({ ...findGoalTagChanges(changedGoal, incGoal) });
          }
        }
      }
      if (currentDisplay !== typeAtPriority) {
        setCurrentDisplay(typeAtPriority);
      }
    }
  };

  useEffect(() => {
    getChanges();
  }, [activePPT, currentDisplay]);

  useEffect(() => {
    async function init() {
      if (!currentMainGoal) {
        return;
      }
      const inbox = await getInboxItem(currentMainGoal.id);
      const ppsList = (await getAllContacts()).filter((ele) => Object.keys(inbox.changes).includes(ele.relId));
      setParticipants([...ppsList]);
      setActivePPT(0);
    }
    init();
  }, [currentMainGoal]);

  return (
    <ZModal type="popupModal" open>
      {currentMainGoal && (
        <>
          <SubHeader
            showLeftNav={showSuggestions}
            showRightNav={!showSuggestions}
            title={showSuggestions ? "Suggestions" : "Changes"}
            leftNav={() => {
              setShowSuggestions(false);
            }}
            rightNav={() => {
              setShowSuggestions(true);
            }}
          />
          <div
            className="d-flex gap-4"
            style={{
              height: 36,
              background: "var(--bottom-nav-color)",
            }}
          >
            {participants.map((ele, index) => (
              <button
                type="button"
                key={ele.id}
                style={{
                  width: 100,
                  color: "var(--icon-grad-1)",
                  fontSize: "1.143em",
                  background: `var(--${activePPT === index ? "selection-color" : "bottom-nav-color"})`,
                }}
                className="simple fw-500 br-4"
                onClick={() => {
                  setActivePPT(index);
                }}
              >
                {ele.name}
              </button>
            ))}
          </div>
          {goalUnderReview && participants.length > 0 && (
            <p className="popupModal-title" style={{ marginTop: 22 }}>
              <Header
                contactName={participants[activePPT].name}
                title={currentDisplay === "moved" ? moveGoalTitle : goalUnderReview.title}
                currentDisplay={currentDisplay}
                //newParentTitle={newParentTitle}
              />
            </p>
          )}
          {["deleted", "archived", "restored"].includes(currentDisplay) && <div />}
          {currentDisplay === "modifiedGoals" && getEditChangesList()}
          {(currentDisplay === "subgoals" || currentDisplay === "newGoalMoved") && getSubgoalsList()}
          {currentDisplay === "moved" && getMovedSubgoalsList(moveGoalTitle, oldParentTitle, newParentTitle)}

          <div className="d-flex justify-fe gap-20">
            {goalUnderReview && (
              <>
                <IgnoreBtn deleteChanges={deleteChanges} />
                <AcceptBtn acceptChanges={acceptChanges} typeAtPriority={currentDisplay} />
              </>
            )}
          </div>
        </>
      )}
    </ZModal>
  );
};

export default DisplayChangesModal;
