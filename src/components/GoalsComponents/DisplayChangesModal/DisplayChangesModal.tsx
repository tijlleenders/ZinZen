/* eslint-disable consistent-return */
import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { sendNewGoals } from "@src/helpers/BatchPublisher";
import { darkModeState, lastAction } from "@src/store";
import { getAllContacts } from "@src/api/ContactsAPI";
import { sendUpdatedGoal } from "@src/helpers/PubSubController";
import { typeOfChange, typeOfIntent } from "@src/models/InboxItem";
import { archiveUserGoal, getGoal, removeGoalWithChildrens, updateGoal } from "@src/api/GoalsAPI";
import { deleteGoalChangesInID, getInboxItem, removeGoalInbox, removePPTFromInboxOfGoal } from "@src/api/InboxAPI";
import { findGoalTagChanges, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import { getDeletedGoal, restoreUserGoal } from "@src/api/TrashAPI";
import SubHeader from "@src/common/SubHeader";
import ContactItem from "@src/models/ContactItem";
import ZModal from "@src/common/ZModal";

import { addGoalToNewParentSublist, getAllDescendants, removeGoalFromParentSublist } from "@src/helpers/GoalController";
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

  useEffect(() => {
    const fetchParentTitles = async () => {
      if (!goalUnderReview) return;

      try {
        const currentGoalInDB = await getGoal(goalUnderReview.id);
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
  }, [goalUnderReview]);

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
    if (!goalUnderReview || !currentMainGoal) {
      return;
    }
    const removeChanges =
      currentDisplay === "subgoals"
        ? newGoals.map(({ goal }) => goal.id)
        : currentDisplay === "moved"
          ? [goalUnderReview.id, ...(await getAllDescendants(goalUnderReview.id)).map((goal: GoalItem) => goal.id)]
          : [goalUnderReview.id];

    if (currentDisplay !== "none") {
      await deleteGoalChangesInID(currentMainGoal.id, participants[activePPT].relId, currentDisplay, removeChanges);
    }
    setCurrentDisplay("none");
  };

  const handleMoveChanges = async () => {
    if (!goalUnderReview) {
      console.log("No goal under review.");
      return;
    }
    const parentGoal = await getGoal(goalUnderReview.parentGoalId);

    await Promise.all([
      updateGoal(goalUnderReview.id, { parentGoalId: parentGoal?.id ?? "root" }),
      removeGoalFromParentSublist(goalUnderReview.id, parentGoal?.title ?? "root"),
      addGoalToNewParentSublist(goalUnderReview.id, parentGoal?.id ?? "root"),
    ]);

    // TODO: handle this later
    // await sendUpdatedGoal(
    //   goalUnderReview.id,
    //   [],
    //   true,
    //   updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
    // );
  };

  const acceptChanges = async () => {
    if (!goalUnderReview) {
      return;
    }
    if (currentDisplay !== "none") {
      await deleteChanges();
    }
    if (currentDisplay === "moved") {
      await handleMoveChanges();
    }
    if (currentDisplay === "subgoals") {
      const goalsToBeSelected = newGoals
        .filter(({ goal }) => !unselectedChanges.includes(goal.id))
        .map(({ goal }) => goal);
      await acceptSelectedSubgoals(goalsToBeSelected, goalUnderReview);
      if (goalsToBeSelected.length > 0) {
        const { intent } = newGoals[0];
        await sendNewGoals(goalsToBeSelected, [], true, intent === "suggestion" ? [] : [participants[activePPT].relId]);
      }
      setUnselectedChanges([]);
      setNewGoals([]);
    } else if (currentDisplay === "modifiedGoals") {
      await acceptSelectedTags(unselectedChanges, updateList, goalUnderReview);
      await sendUpdatedGoal(
        goalUnderReview.id,
        [],
        true,
        updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
      );
      setUnselectedChanges([]);
      setUpdateList({ schemaVersion: {}, prettierVersion: {} });
    } else if (currentDisplay === "deleted") {
      await removeGoalWithChildrens(goalUnderReview);
    } else if (currentDisplay === "archived") {
      await archiveUserGoal(goalUnderReview);
    } else if (currentDisplay === "restored") {
      await restoreUserGoal(goalUnderReview);
    }
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
          // TODO: remove the newGoalsMoved and try handle in subgoal only
          if (typeAtPriority === "subgoals") {
            setNewGoals(goals || []);
          } else if (typeAtPriority === "modifiedGoals") {
            setUpdatesIntent(goals[0].intent);
            const incGoal: GoalItem = { ...goals[0].goal };
            setUpdateList({ ...findGoalTagChanges(changedGoal, incGoal) });
          } else if (typeAtPriority === "moved") {
            setUpdatesIntent(goals[0].intent);
            setGoalUnderReview({ ...goals[0].goal });
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

  const getChangedGoalFromRoot = async (rootGoal: GoalItem, relId: string) => {
    const { typeAtPriority, goals, parentId } = await jumpToLowestChanges(rootGoal.id, relId);

    if (typeAtPriority === "none") return { typeAtPriority, goals, parentId };

    const changedGoal = await getGoal(parentId);
    if (!changedGoal) return { typeAtPriority, goals, parentId };

    return {
      typeAtPriority,
      goals,
      parentId,
      changedGoal,
      rootGoal,
    };
  };

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
                title={goalUnderReview.title}
                currentDisplay={currentDisplay}
              />
            </p>
          )}
          {["deleted", "archived", "restored"].includes(currentDisplay) && <div />}
          {currentDisplay === "modifiedGoals" && getEditChangesList()}
          {currentDisplay === "subgoals" && getSubgoalsList()}
          {currentDisplay === "moved" && getMovedSubgoalsList(goalUnderReview, oldParentTitle, newParentTitle)}

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
