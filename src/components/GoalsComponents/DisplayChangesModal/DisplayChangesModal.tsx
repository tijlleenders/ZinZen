import { darkModeState } from "@src/store";
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import plus from "@assets/images/plus.svg";
import ignore from "@assets/images/ignore.svg";

import "./DisplayChangesModal.scss";
import { GoalItem } from "@src/models/GoalItem";
import { OutboxItem } from "@src/models/OutboxItem";
import { getDump } from "@src/api/OutboxAPI";

interface IDisplayChangesModalProps {
  showChangesModal: {
    open: boolean,
    goal: GoalItem,
  },
  setShowChangesModal: React.Dispatch<React.SetStateAction<{
      open: boolean;
      goal: GoalItem ;
  } | null>>
}

const DisplayChangesModal: React.FC<IDisplayChangesModalProps> = ({ showChangesModal, setShowChangesModal }) => {
  const [changes, setChanges] = useState<OutboxItem|null>();
  const darkModeStatus = useRecoilValue(darkModeState);
  const { open } = showChangesModal;
  let contactName = "";
  let goalTitle = "";
  if (showChangesModal) {
    contactName = showChangesModal.goal.shared?.name || "";
    goalTitle = showChangesModal.goal.title;
  }
  useEffect(() => {
    if (showChangesModal) {
      getDump(showChangesModal.goal.shared?.relId, showChangesModal.goal.id).then((res) => setChanges(res));
    }
  }, [showChangesModal]);

  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""}`}
      style={{ maxWidth: "410px", width: "calc(100vw - 15px)" }}
      show={open}
      onHide={() => { setShowChangesModal(null); }}
    >
      <Modal.Body>
        <h2>
          {contactName} added to {goalTitle}.<br />
          Add as well ?
        </h2>
        <Form className="changes-list">
          { changes?.subgoals.map((ele) => (
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
