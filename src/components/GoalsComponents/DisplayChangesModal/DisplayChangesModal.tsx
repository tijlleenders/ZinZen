/* eslint-disable consistent-return */
import { Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { typeOfChange } from "@src/models/InboxItem";
import { displayChangesModal } from "@src/store/GoalsState";
import { findGoalTagChanges } from "@src/helpers/GoalProcessor";
import { ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { acceptChangesOf } from "@src/helpers/InboxProcessor";
import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";

import "./DisplayChangesModal.scss";

const DisplayChangesModal = () => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [activeGoal, setActiveGoal] = useState<GoalItem>();
  const [updateList, setUpdateList] = useState<ITagsChanges>({ schemaVersion: {}, prettierVersion: {} });
  const [activeContact, setActiveContact] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none" | "conversionRequest">("none");
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [unselectedChanges, setUnselectedChanges] = useState<string[]>([]);

  const getEditChangesList = () => {
    const { prettierVersion } = updateList;
    return (
      <div className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
        {Object.keys(prettierVersion).map((k) => (
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
              <span className="existingChange">{prettierVersion[k].oldVal}</span>&nbsp;
              <span className="incomingChange">{prettierVersion[k].newVal}</span>
            </p>
          </div>
        ))}
      </div>
    );
  };

  const getSubgoalsList = () =>
    showChangesModal?.goals.map((ele) => (
      <div key={`${ele.id}-subgoal`} style={{ display: "flex" }}>
        <Checkbox
          checked={!unselectedChanges.includes(ele.id)}
          onChange={(e) => {
            setUnselectedChanges([
              ...(e.target.checked ? unselectedChanges.filter((id) => id !== ele.id) : [...unselectedChanges, ele.id]),
            ]);
          }}
          className="checkbox"
        />
        <span>&nbsp;{ele.title}</span>
      </div>
    ));

  const acceptChanges = async () => {
    if (showChangesModal) {
      await acceptChangesOf(unselectedChanges, showChangesModal, updateList, activeGoal);
    }
    setUnselectedChanges([]);
  };
  const getChanges = () =>
    currentDisplay === "archived" || currentDisplay === "deleted" ? (
      <div />
    ) : currentDisplay === "modifiedGoals" ? (
      getEditChangesList()
    ) : (
      getSubgoalsList()
    );
  useEffect(() => {
    const getInbox = async () => {
      if (showChangesModal) {
        const goal = await getGoal(showChangesModal.parentId);
        const rootGoal = await getGoal(goal.rootGoalId);
        if (showChangesModal.typeAtPriority === "conversionRequest") {
          setActiveContact(rootGoal.shared.contacts[0].name);
        } else {
          setActiveContact(rootGoal.collaboration.collaborators[0].name);
        }
        if (showChangesModal.typeAtPriority === "modifiedGoals") {
          const incGoal: GoalItem = { ...showChangesModal.goals[0] };
          const currGoal = await getGoal(showChangesModal.parentId);
          setUpdateList({ ...findGoalTagChanges(currGoal, incGoal) });
        }
        setCurrentDisplay(showChangesModal.typeAtPriority);
        setActiveGoal(goal);
      }
    };
    getInbox();
  }, [showChangesModal]);

  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
        theme[darkModeStatus ? "dark" : "light"]
      }`}
      open={!!showChangesModal}
      onCancel={() => {
        setShowChangesModal(null);
      }}
      closable={false}
      footer={null}
    >
      {showChangesModal && activeGoal && (
        <>
          {activeGoal && (
            <p className="popupModal-title">
              <Header contactName={activeContact} title={activeGoal.title} currentDisplay={currentDisplay} />
            </p>
          )}
          {getChanges()}
          <AcceptBtn
            goal={activeGoal}
            acceptChanges={acceptChanges}
            showChangesModal={showChangesModal}
            setShowChangesModal={setShowChangesModal}
          />
          <IgnoreBtn goal={activeGoal} showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} />
        </>
      )}
    </Modal>
  );
  return <div />;
};

export default DisplayChangesModal;
