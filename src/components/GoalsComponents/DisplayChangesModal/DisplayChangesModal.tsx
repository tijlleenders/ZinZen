/* eslint-disable consistent-return */
import { Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { darkModeState } from "@src/store";
import { getAllContacts } from "@src/api/ContactsAPI";
import { archiveUserGoal, getGoal, removeGoalWithChildrens, updateGoal } from "@src/api/GoalsAPI";
import { displayChangesModal } from "@src/store/GoalsState";
import { typeOfChange, typeOfIntent } from "@src/models/InboxItem";
import { deleteGoalChangesInID, getInboxItem } from "@src/api/InboxAPI";
import { findGoalTagChanges, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import SubHeader from "@src/common/SubHeader";
import ContactItem from "@src/models/ContactItem";

import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";
import "./DisplayChangesModal.scss";

const DisplayChangesModal = () => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showChangesModal = useRecoilValue(displayChangesModal);

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

  const getSubgoalsList = () => (
    <div
      style={{
        background: "var(--secondary-background)",
        borderRadius: 8,
      }}
    >
      {newGoals.map(({ goal, intent }) => (
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

  const deleteChanges = async () => {
    if (!activeGoal) {
      return;
    }
    const removeChanges = currentDisplay === "subgoals" ? newGoals.map(({ goal }) => goal.id) : [activeGoal.id];
    if (currentDisplay !== "none") {
      await deleteGoalChangesInID(activeGoal.rootGoalId, participants[activePPT].relId, currentDisplay, removeChanges);
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
      await acceptSelectedSubgoals(
        newGoals.filter(({ goal }) => !unselectedChanges.includes(goal.id)).map(({ goal }) => goal),
        activeGoal,
      );
      setUnselectedChanges([]);
      setNewGoals([]);
    } else if (currentDisplay === "modifiedGoals") {
      await acceptSelectedTags(unselectedChanges, updateList, activeGoal);
      setUnselectedChanges([]);
      setUpdateList({ schemaVersion: {}, prettierVersion: {} });
    } else if (currentDisplay === "deleted") {
      await removeGoalWithChildrens(activeGoal);
    } else if (currentDisplay === "archived") {
      await archiveUserGoal(activeGoal);
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
        await updateGoal(showChangesModal.rootGoalId, { newUpdates: false });
        window.history.back();
      }
      const changedGoal = await getGoal(parentId);
      if (changedGoal) {
        setActiveGoal({ ...changedGoal });
        if (typeAtPriority === "subgoals") {
          setNewGoals(goals || []);
        } else if (typeAtPriority === "modifiedGoals") {
          const incGoal: GoalItem = { ...goals[0].goal };
          setUpdateList({ ...findGoalTagChanges(changedGoal, incGoal) });
        }
        if (currentDisplay !== typeAtPriority) {
          setCurrentDisplay(typeAtPriority);
        }
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
      console.log("🚀 ~ file: DisplayChangesModal.tsx:190 ~ init ~ inbox:", inbox);
      const ppsList = (await getAllContacts()).filter((ele) => Object.keys(inbox.changes).includes(ele.relId));
      setParticipants([...ppsList]);
      setActivePPT(0);
    }
    init();
  }, []);
  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
        theme[darkModeStatus ? "dark" : "light"]
      }`}
      open={!!showChangesModal}
      onCancel={() => {
        window.history.back();
      }}
      closable={false}
      footer={null}
    >
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
              background: "var(--bottom-nav-color)",
            }}
          >
            {participants.map((ele) => (
              <button
                type="button"
                style={{
                  width: 100,
                  borderRadius: 4,
                  background: "var(--secondary-background)",
                  color: "var(--icon-grad-1)",
                  fontWeight: 500,
                  fontSize: "1.143em",
                  // background: `var(--${activePPT === index ? "selection-color" : "bottom-nav-color"})`,
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
          {/* )} */}
          {(currentDisplay === "archived" || currentDisplay === "deleted") && <div />}
          {currentDisplay === "modifiedGoals" && getEditChangesList()}
          {currentDisplay === "subgoals" && getSubgoalsList()}
          <div style={{ display: "flex", gap: 18, justifyContent: "flex-end" }}>
            {activeGoal && (
              <>
                <IgnoreBtn deleteChanges={deleteChanges} />
                <AcceptBtn goal={activeGoal} acceptChanges={acceptChanges} typeAtPriority={currentDisplay} />
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
  return <div />;
};

export default DisplayChangesModal;
