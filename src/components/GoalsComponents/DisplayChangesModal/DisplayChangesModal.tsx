/* eslint-disable consistent-return */
import { Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";
import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { displayChangesModal } from "@src/store/GoalsState";
import { findGoalTagChanges } from "@src/helpers/GoalProcessor";
import { addGoal, addIntoSublist, archiveUserGoal, getGoal, removeGoalWithChildrens, updateGoal } from "@src/api/GoalsAPI";
import Header from "./Header";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";

import "./DisplayChangesModal.scss";

const DisplayChangesModal = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [activeContact, setActiveContact] = useState("");
  const [activeGoal, setActiveGoal] = useState<GoalItem>();
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none" | "conversionRequest">("none");
  const [unselectedChanges, setUnselectedChanges] = useState<string[]>([]);

  const [updateList, setUpdateList] = useState({ schemaVersion: { }, prettierVersion: { } });
  console.log(unselectedChanges);
  const getEditChangesList = () => {
    const { prettierVersion } = updateList;
    return (
      <Form className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
        { Object.keys(prettierVersion).map((k) => (
          <div key={`${k}-edit`}>
            <Form.Check
              type="checkbox"
              name="TagsChanges"
              checked={!unselectedChanges.includes(k)}
              className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
              onChange={(e) => {
                setUnselectedChanges([...(e.target.checked ? unselectedChanges.filter((tag) => tag !== k) : [...unselectedChanges, k])]);
              }}
            />
            <p>
              &nbsp;{k}:&nbsp;
              <span className="existingChange">{prettierVersion[k].oldVal}</span>&nbsp;
              <span className="incomingChange">{prettierVersion[k].newVal}</span>
            </p>
          </div>
        ))}
      </Form>
    );
  };

  const getSubgoalsList = () => showChangesModal?.goals.map((ele) => (
    <div key={`${ele.id}-subgoal`} style={{ display: "flex" }}>
      <Form.Check
        checked={!unselectedChanges.includes(ele.id)}
        onChange={(e) => {
          setUnselectedChanges([...(e.target.checked ? unselectedChanges.filter((id) => id !== ele.id) : [...unselectedChanges, ele.id])]);
        }}
        className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
        name="NewSubgoals"
        type="checkbox"
      /> <p>&nbsp;{ele.title}</p>
    </div>
  ));

  const acceptChanges = async () => {
    if (showChangesModal) {
      const goal = showChangesModal.goals[0];
      if (showChangesModal.typeAtPriority === "subgoals" && activeGoal) {
        const childrens: string[] = [];
        showChangesModal.goals.forEach(async (colabGoal: GoalItem) => {
          if (!(unselectedChanges.includes(colabGoal.id))) {
            addGoal(colabGoal).catch((err) => console.log(err));
            childrens.push(colabGoal.id);
          }
        });
        addIntoSublist(activeGoal.id, childrens).then(() => { setShowChangesModal(null); });
      } if (showChangesModal.typeAtPriority === "modifiedGoals") {
        const { schemaVersion, prettierVersion } = updateList;
        const finalChanges = { };
        Object.keys(prettierVersion).forEach((ele) => {
          if (!(unselectedChanges.includes(ele))) {
            if (ele === "timing") {
              if (schemaVersion.hasOwnProperty("afterTime")) { finalChanges.afterTime = schemaVersion.afterTime; }
              if (schemaVersion.hasOwnProperty("beforeTime")) { finalChanges.beforeTime = schemaVersion.beforeTime; }
            } else finalChanges[ele] = schemaVersion[ele]; 
          }
        });
        await updateGoal(goal.id, finalChanges);
      } else if (showChangesModal.typeAtPriority === "deleted") {
        await removeGoalWithChildrens(goal);
      } else if (showChangesModal.typeAtPriority === "archived") {
        await archiveUserGoal(goal);
      }
      setUnselectedChanges([]);
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
