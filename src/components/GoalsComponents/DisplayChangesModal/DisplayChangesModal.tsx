/* eslint-disable consistent-return */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { sendNewGoals } from "@src/helpers/BatchPublisher";
import { darkModeState } from "@src/store";
import { getAllContacts } from "@src/api/ContactsAPI";
import { sendUpdatedGoal } from "@src/helpers/PubSubController";
import { displayChangesModal } from "@src/store/GoalsState";
import { typeOfChange, typeOfIntent } from "@src/models/InboxItem";
import { archiveUserGoal, getGoal, removeGoalWithChildrens, updateGoal } from "@src/api/GoalsAPI";
import { deleteGoalChangesInID, getInboxItem, removeGoalInbox, removePPTFromInboxOfGoal } from "@src/api/InboxAPI";
import { findGoalTagChanges, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import { getDeletedGoal, restoreUserGoal } from "@src/api/TrashAPI";
import SubHeader from "@src/common/SubHeader";
import ContactItem from "@src/models/ContactItem";
import ZModal from "@src/common/ZModal";

import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";
import "./DisplayChangesModal.scss";

const DisplayChangesModal = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const showChangesModal = useRecoilValue(displayChangesModal);

  const [updatesIntent, setUpdatesIntent] = useState<typeOfIntent>("shared");
  const [newGoals, setNewGoals] = useState<{ intent: typeOfIntent; goal: GoalItem }[]>([]);
  const [activePPT, setActivePPT] = useState(-1);
  const [updateList, setUpdateList] = useState<ITagsChanges>({ schemaVersion: {}, prettierVersion: {} });
  const [activeGoal, setActiveGoal] = useState<GoalItem>();
  const [participants, setParticipants] = useState<ContactItem[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none">("none");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unselectedChanges, setUnselectedChanges] = useState<string[]>([]);

  const getEditChangesList = () => {
    const { prettierVersion } = updateList;
    return (
      <div className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
        {Object.keys(prettierVersion).map((k) => {
          const { oldVal } = prettierVersion[k];
          const { newVal } = prettierVersion[k];
          // if (k === "timeBudget") {
          //   const oldParsed = JSON.parse(oldVal);
          //   const newParsed = JSON.parse(newVal);
          //   oldVal = `${oldParsed.perDay}/day, ${oldParsed.perWeek}/week`;
          //   newVal = `${newParsed.perDay}/day, ${newParsed.perWeek}/week`;
          // }
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
            {/* <span
            className="intent"
            style={{
              border: `1px solid ${goal.goalColor}`,
              position: "absolute",
              right: 50,
              padding: "0px 9px",
              borderRadius: 12,
            }}
          >
            {intent}
          </span> */}
          </div>
        ))}
      </div>
    );
  };

  const deleteChanges = async () => {
    if (!activeGoal || !showChangesModal) {
      return;
    }
    const removeChanges = currentDisplay === "subgoals" ? newGoals.map(({ goal }) => goal.id) : [activeGoal.id];
    if (currentDisplay !== "none") {
      await deleteGoalChangesInID(showChangesModal.id, participants[activePPT].relId, currentDisplay, removeChanges);
    }
    setCurrentDisplay("none");
  };
  const acceptChanges = async () => {
    if (!activeGoal) {
      return;
    }
    if (currentDisplay !== "none") {
      await deleteChanges();
    }
    if (currentDisplay === "subgoals") {
      const goalsToBeSelected = newGoals
        .filter(({ goal }) => !unselectedChanges.includes(goal.id))
        .map(({ goal }) => goal);
      await acceptSelectedSubgoals(goalsToBeSelected, activeGoal);
      if (goalsToBeSelected.length > 0) {
        const { intent } = newGoals[0];
        await sendNewGoals(goalsToBeSelected, [], true, intent === "suggestion" ? [] : [participants[activePPT].relId]);
      }
      setUnselectedChanges([]);
      setNewGoals([]);
    } else if (currentDisplay === "modifiedGoals") {
      await acceptSelectedTags(unselectedChanges, updateList, activeGoal);
      await sendUpdatedGoal(
        activeGoal.id,
        [],
        true,
        updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
      );
      setUnselectedChanges([]);
      setUpdateList({ schemaVersion: {}, prettierVersion: {} });
    } else if (currentDisplay === "deleted") {
      await removeGoalWithChildrens(activeGoal);
    } else if (currentDisplay === "archived") {
      await archiveUserGoal(activeGoal);
    } else if (currentDisplay === "restored") {
      await restoreUserGoal(activeGoal);
    }
    setCurrentDisplay("none");
  };

  const getChanges = async () => {
    if (showChangesModal && participants.length > 0 && activePPT >= 0) {
      const { typeAtPriority, goals, parentId } = await jumpToLowestChanges(
        showChangesModal.id,
        participants[activePPT].relId,
      );
      if (typeAtPriority === "none") {
        // remove participant from inbox
        if (participants.length === 1) {
          await removeGoalInbox(showChangesModal.id);
          await updateGoal(showChangesModal.id, { newUpdates: false });
          window.history.back();
          return;
        }
        await removePPTFromInboxOfGoal(showChangesModal.id, participants[activePPT].relId);
        const currPPT = participants[activePPT].relId;
        setActivePPT(0);
        setParticipants([...participants.filter((ele) => ele.relId !== currPPT)]);
      } else if (typeAtPriority === "restored") {
        const goalToBeRestored = await getDeletedGoal(parentId);
        console.log("🚀 ~ getChanges ~ goalToBeRestored:", goalToBeRestored);
        if (goalToBeRestored) {
          delete goalToBeRestored.deletedAt;
          setActiveGoal(goalToBeRestored);
        }
      } else {
        const changedGoal = await getGoal(parentId);
        if (changedGoal) {
          setActiveGoal({ ...changedGoal });
          if (typeAtPriority === "subgoals") {
            setNewGoals(goals || []);
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
      if (!showChangesModal) {
        return;
      }
      const inbox = await getInboxItem(showChangesModal.id);
      const ppsList = (await getAllContacts()).filter((ele) => Object.keys(inbox.changes).includes(ele.relId));
      setParticipants([...ppsList]);
      setActivePPT(0);
    }
    init();
  }, []);
  return (
    <ZModal type="popupModal" open={!!showChangesModal} onCancel={() => window.history.back()}>
      {showChangesModal && (
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
            style={{
              display: "flex",
              height: 36,
              gap: 5,
              background: "var(--bottom-nav-color)",
            }}
          >
            {participants.map((ele, index) => (
              <button
                type="button"
                style={{
                  width: 100,
                  borderRadius: 4,
                  // background: "var(--secondary-background)",
                  color: "var(--icon-grad-1)",
                  fontWeight: 500,
                  fontSize: "1.143em",
                  background: `var(--${activePPT === index ? "selection-color" : "bottom-nav-color"})`,
                }}
                onClick={() => {
                  setActivePPT(index);
                }}
                key={ele.id}
                className="ordinary-element"
              >
                {ele.name}
              </button>
            ))}
          </div>
          {activeGoal && participants.length > 0 && (
            <p className="popupModal-title" style={{ marginTop: 22 }}>
              <Header
                contactName={participants[activePPT].name}
                title={activeGoal.title}
                currentDisplay={currentDisplay}
              />
            </p>
          )}
          {["deleted", "archived", "restored"].includes(currentDisplay) && <div />}
          {currentDisplay === "modifiedGoals" && getEditChangesList()}
          {currentDisplay === "subgoals" && getSubgoalsList()}

          <div style={{ display: "flex", gap: 18, justifyContent: "flex-end" }}>
            {activeGoal && (
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
