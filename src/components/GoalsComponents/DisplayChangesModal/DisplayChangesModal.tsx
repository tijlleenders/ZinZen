/* eslint-disable consistent-return */
import { darkModeState } from "@src/store";
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { GoalItem } from "@src/models/GoalItem";
import { OutboxItem } from "@src/models/OutboxItem";
import { cleanChangesOf, completeChanges, deleteChanges, getDump } from "@src/api/OutboxAPI";
import { addGoal, addIntoSublist, archiveUserGoal, changeNewUpdatesStatus, notifyItsAncestor, updateGoal } from "@src/api/GoalsAPI";
import { formatTagsToText } from "@src/helpers/GoalProcessor";
import { IChangesInGoal, typeOfChange } from "@src/models/InboxItem";
import AcceptBtn from "./AcceptBtn";
import IgnoreBtn from "./IgnoreBtn";

import "./DisplayChangesModal.scss";
import { getInboxItem } from "@src/api/InboxAPI";
import { getDefaultValueOfGoalChanges } from "@src/utils";
import Header from "./Header";

const tags = ["title", "duration", "repeat", "start", "due", "afterTime", "beforeTime", "goalColor", "language", "link"];
interface IDisplayChangesModalProps {
  showChangesModal: GoalItem | null,
  setShowChangesModal: React.Dispatch<React.SetStateAction<GoalItem | null>>
}

const DisplayChangesModal: React.FC<IDisplayChangesModalProps> = ({ showChangesModal, setShowChangesModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [changes, setChanges] = useState<OutboxItem|null>(null);
  const [activeChanges, setActiveChanges] = useState<IChangesInGoal>(getDefaultValueOfGoalChanges());
  const [currentDisplay, setCurrentDisplay] = useState<typeOfChange | "none">("none");

  if (showChangesModal) {
    const conversionRequests = showChangesModal?.shared.conversionRequests.status;
    const handleCurrentDisplay = () => {
      if (activeChanges.subgoals.length > 0) { setCurrentDisplay("subgoals"); } else if (activeChanges.modifiedGoals.length > 0) { setCurrentDisplay("modifiedGoals"); } else if (activeChanges.archived.length > 0) { setCurrentDisplay("archived"); } else if (activeChanges.deleted.length > 0) { setCurrentDisplay("deleted"); } else setCurrentDisplay("none");
    };

    const getEditChangesList = () => {
      if (changes && currentDisplay) {
        const incGoal: GoalItem = changes.updates.slice(-1)[0];
        const currFormatTags = formatTagsToText(showChangesModal);
        const incFormatTags = formatTagsToText(incGoal);

        Object.keys(incGoal).forEach((key) => {
          if (!tags.includes(key) || incGoal[key] === showChangesModal[key] || (incFormatTags[key] === currFormatTags[key])) {
            delete incGoal[key];
          }
        });

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
                    {currFormatTags[k]}
                  </span>&nbsp;
                  <span className="incomingChange">
                    {incFormatTags[k]}

                  </span>
                </p>
              </div>
            ))}
          </Form>
        );
      }
    };
    useEffect(() => {
      const getInbox = async () => {
        if (showChangesModal && !conversionRequests) {
          const res = await getInboxItem(showChangesModal.id);
          if (res) { setActiveChanges(res.goalChanges); }
        }
      };
      getInbox();
    }, [showChangesModal]);

    useEffect(() => {
      handleCurrentDisplay();
    }, [activeChanges]);
    console.log(currentDisplay)
    return (
      <Modal
        className={`popupModal${darkModeStatus ? "-dark" : ""}`}
        style={{ maxWidth: "410px", width: "calc(100vw - 15px)" }}
        show={!!showChangesModal}
        onHide={() => { setShowChangesModal(null); }}
      >
        <Modal.Body>
          <h2><Header goal={showChangesModal} currentDisplay={currentDisplay} /></h2>
          { currentDisplay === "subgoals" && (
            <Form className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
              { activeChanges[currentDisplay].map((ele) => (
                <div key={`${ele.goal.id}-subgoal`}>
                  <Form.Check
                    checked
                    disabled
                    className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
                    name="group1"
                    type="checkbox"
                  /> <p>&nbsp;{ele.goal.title}</p>
                </div>
              ))}
            </Form>
          )}
          {/* { currentDisplay === "modifiedGoals" && getEditChangesList() } */}
          <AcceptBtn goal={showChangesModal} changeType={currentDisplay} setShowChangesModal={setShowChangesModal}/>
          <IgnoreBtn goal={showChangesModal} changeType={currentDisplay} setShowChangesModal={setShowChangesModal}/>
        </Modal.Body>
      </Modal>
    );
  }
  return <div />;
};

export default DisplayChangesModal;
