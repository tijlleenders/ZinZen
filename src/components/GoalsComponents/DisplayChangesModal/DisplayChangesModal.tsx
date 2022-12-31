import { darkModeState } from "@src/store";
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import plus from "@assets/images/plus.svg";
import ignore from "@assets/images/ignore.svg";

import "./DisplayChangesModal.scss";
import { GoalItem } from "@src/models/GoalItem";
import { OutboxItem } from "@src/models/OutboxItem";
import { cleanChangesOf, getDump } from "@src/api/OutboxAPI";
import { addGoal, addIntoSublist, changeNewUpdatesStatus } from "@src/api/GoalsAPI";

interface IDisplayChangesModalProps {
  showChangesModal: GoalItem | null,
  setShowChangesModal: React.Dispatch<React.SetStateAction<GoalItem | null>>
}

const DisplayChangesModal: React.FC<IDisplayChangesModalProps> = ({ showChangesModal, setShowChangesModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [changes, setChanges] = useState<OutboxItem|null>(null);
  const [activeChange, setActiveChange] = useState(["deletedGoals", "updatedGoals", "subgoals"]);
  const show = activeChange.slice(-1)[0];
  let contactName = "";
  let goalTitle = "";
  if (showChangesModal) {
    contactName = showChangesModal.shared?.name || "";
    goalTitle = showChangesModal.title;
  }

  const handleChoice = async (choice:string) => {
    if (show === "subgoals") {
      if (choice === "accept") {
        const promisesArr = changes?.subgoals.map((ele) => addGoal({ ...ele, parentGoalId: showChangesModal.id }));
        await Promise.all(promisesArr).then((ids: string[]) => {
          addIntoSublist(showChangesModal.id, ids).then(() => console.log("sublist updates in parent"));
        }).catch((err) => console.log("failed to add subgoals", err));
      }
      await cleanChangesOf(showChangesModal.id, show);
    }
    const tmp = [...activeChange.filter((ele) => ele !== show && changes[ele].length !== 0)];
    setActiveChange([...tmp]);
    if (tmp.length === 0) {
      await changeNewUpdatesStatus(false, showChangesModal.id);
      setChanges(null);
      setShowChangesModal(null);
    }
  };
  useEffect(() => {
    const getOutbox = async () => {
      if (showChangesModal) {
        console.log(showChangesModal)
        const res = await getDump(showChangesModal.shared?.relId, showChangesModal.id);
        if (res) {
          console.log(res);
          const tmp = [...activeChange.filter((ele) => res[ele].length !== 0)];
          setActiveChange([...tmp]);
          console.log(tmp)
          if (tmp.length === 0) {
            setShowChangesModal(null);
          }
          setChanges(res);
        }
      }
    };
    getOutbox();
  }, [showChangesModal]);

  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""}`}
      style={{ maxWidth: "410px", width: "calc(100vw - 15px)" }}
      show={!!showChangesModal}
      onHide={() => { setShowChangesModal(null); }}
    >
      <Modal.Body>
        <h2>
          {contactName} added to {goalTitle}.<br />
          Add as well ?
        </h2>
        <Form className="changes-list">
          { changes && show && changes[show].map((ele) => (
            <div key={`${ele.id}-subgoal`}>
              <Form.Check
                checked
                disabled
                name="group1"
                type="checkbox"
              /> <p>&nbsp;{ele.title}</p>
            </div>
          ))}
        </Form>
        <button
          type="button"
          style={{ width: "100%", justifyContent: "flex-start" }}
          className={`default-btn${darkModeStatus ? "-dark" : ""}`}
          onClick={async () => { await handleChoice("accept"); }}
        >
          <img
            alt="add changes"
            src={plus}
            width={25}
          />&nbsp;Add all checked
        </button>
        <button
          type="button"
          style={{ backgroundColor: "rgba(214, 211, 211, 0.6)", width: "100%", justifyContent: "flex-start" }}
          className={`default-btn${darkModeStatus ? "-dark" : ""}`}
          onClick={async () => { await handleChoice("ignore"); }}
        >
          <img
            alt="add changes"
            src={ignore}
            width={25}
          />&nbsp;Ignore all
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default DisplayChangesModal;
