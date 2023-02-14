/* eslint-disable consistent-return */
import { Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { displayChangesModal } from "@src/store/GoalsState";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import { archiveUserGoal, getGoal, removeGoalWithChildrens, updateGoal } from "@src/api/GoalsAPI";
import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";

import "./DisplayChangesModal.scss";

const tags = ["title", "duration", "repeat", "start", "due", "afterTime", "beforeTime", "goalColor", "language", "link"];

const DisplayChangesModal = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [activeContact, setActiveContact] = useState("");
  const [activeGoal, setActiveGoal] = useState<GoalItem>();
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none" | "conversionRequest">("none");

  const [updateList, setUpdateList] = useState({
    currTags: {}, incTags: {}, incGoal: {}
  });

  const getEditChangesList = () => {
    const { currTags, incTags, incGoal } = updateList;
    return (
      <Form className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
        { Object.keys(incGoal).map((k) => (
          <div key={`${k}-edit`}>
            <Form.Check
              checked
              disabled
              name="group1"
              className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
              type="checkbox"
            /> <p>&nbsp;{k}:&nbsp;
              <span className="existingChange">
                {currTags[k]}
              </span>&nbsp;
              <span className="incomingChange">
                {incTags[k]}

              </span>
            </p>
          </div>
        ))}
      </Form>
    );
  };

  const getSubgoalsList = () => showChangesModal?.goals.map((ele) => (
    <div key={`${ele.id}-subgoal`} style={{ display: "flex" }}>
      <Form.Check
        checked
        disabled
        className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
        name="group1"
        type="checkbox"
      /> <p>&nbsp;{ele.title}</p>
    </div>
  ));

  const acceptChanges = async () => {
    if (showChangesModal) {
      const goal = showChangesModal.goals[0];
      if (showChangesModal.typeAtPriority === "modifiedGoals") {
        await updateGoal(goal.id, updateList.incGoal);
      } else if (showChangesModal.typeAtPriority === "deleted") {
        await removeGoalWithChildrens(goal);
      } else if (showChangesModal.typeAtPriority === "archived") {
        await archiveUserGoal(goal);
      }
    }
  };
  const getChanges = () => (
    currentDisplay === "archived" || currentDisplay === "deleted" ? <div /> :
      currentDisplay === "modifiedGoals" ? getEditChangesList() : getSubgoalsList()
  );
  useEffect(() => {
    const getInbox = async () => {
      if (showChangesModal) {
        const goal = await getGoal(showChangesModal.parentId);
        const rootGoal = await getGoal(goal.rootGoalId);
        if (showChangesModal.typeAtPriority === "conversionRequest") {
          setActiveContact(rootGoal.shared.contacts[0].name);
        } else { setActiveContact(rootGoal.collaboration.collaborators[0].name); }
        console.log(showChangesModal, goal);
        if (showChangesModal.typeAtPriority === "modifiedGoals") {
          const incGoal: GoalItem = { ...(showChangesModal.goals[0]) };
          const currGoal = await getGoal(showChangesModal.parentId);
          const incTags = formatTagsToText(incGoal);
          const currTags = formatTagsToText(currGoal);
          Object.keys(incGoal).forEach((key) => {
            if (!tags.includes(key) || incGoal[key] === currGoal[key] || (incTags[key] === currTags[key])) {
              delete incGoal[key];
            }
          });
          setUpdateList({ incGoal, currTags, incTags });
        }
        setCurrentDisplay(showChangesModal.typeAtPriority);
        setActiveGoal(goal);
      }
    };
    getInbox();
  }, [showChangesModal]);

  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""}`}
      style={{ maxWidth: "410px", width: "calc(100vw - 15px)" }}
      show={!!showChangesModal}
      onHide={() => { setShowChangesModal(null); }}
    >
      { showChangesModal && activeGoal && (
        <Modal.Body>
          { activeGoal && <h2><Header contactName={activeContact} title={activeGoal.title} currentDisplay={currentDisplay} /></h2> }
          {getChanges()}
          <AcceptBtn goal={activeGoal} acceptChanges={acceptChanges} showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} />
          <IgnoreBtn goal={activeGoal} showChangesModal={showChangesModal} setShowChangesModal={setShowChangesModal} />
        </Modal.Body>
      )}
    </Modal>
  );
  return <div />;
};

export default DisplayChangesModal;
