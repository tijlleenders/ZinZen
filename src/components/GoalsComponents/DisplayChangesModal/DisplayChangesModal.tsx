import { darkModeState } from "@src/store";
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import plus from "@assets/images/plus.svg";
import ignore from "@assets/images/ignore.svg";
import trash from "@assets/images/trash.svg";

import { GoalItem } from "@src/models/GoalItem";
import { OutboxItem } from "@src/models/OutboxItem";
import { cleanChangesOf, completeChanges, deleteChanges, getDump } from "@src/api/OutboxAPI";
import { addGoal, addIntoSublist, archiveUserGoal, changeNewUpdatesStatus, updateGoal } from "@src/api/GoalsAPI";
import { formatTagsToText } from "@src/helpers/GoalConvertor";

import "./DisplayChangesModal.scss";

const tags = ["title", "duration", "repeat", "start", "due", "afterTime", "beforeTime", "goalColor", "language", "link"];
interface IDisplayChangesModalProps {
  showChangesModal: GoalItem | null,
  setShowChangesModal: React.Dispatch<React.SetStateAction<GoalItem | null>>
}

const DisplayChangesModal: React.FC<IDisplayChangesModalProps> = ({ showChangesModal, setShowChangesModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [changes, setChanges] = useState<OutboxItem|null>(null);
  const [activeChange, setActiveChange] = useState(["deletedGoals", "updatedGoals", "subgoals", "completedGoals"]);
  const show = activeChange.slice(-1)[0];
  if (showChangesModal) {
    const getMessage = () => {
      if (showChangesModal) {
        const contactName = showChangesModal.shared?.name || "";
        const goalTitle = showChangesModal.title;
        switch (show) {
          case "subgoals":
            return <> {contactName} added to {goalTitle}.<br /> Add as well ?</>;
          case "deletedGoals":
            return <> {contactName} deleted {goalTitle}. </>;
          case "updatedGoals":
            return <> {contactName} made changes in {goalTitle}.<br /> Make changes ? </>;
          case "completedGoals":
            return <> {contactName} completed {goalTitle} </>;
          default:
            return null;
        }
      }
    };
    const handleChoice = async (choice:string) => {
      if (show === "subgoals") {
        if (choice === "accept") {
          const promisesArr = changes?.subgoals.map((ele) => addGoal({ ...ele, parentGoalId: showChangesModal.id }));
          await Promise.all(promisesArr).then((ids: string[]) => {
            addIntoSublist(showChangesModal.id, ids).then(() => console.log("sublist updates in parent"));
          }).catch((err) => console.log("failed to add subgoals", err));
        }
        await cleanChangesOf(showChangesModal.id, show);
      } else if (show === "deletedGoals") {
        if (choice === "accept") {
          await deleteChanges(true, showChangesModal.id);
        }
      } else if (show === "updatedGoals") {
        if (choice === "accept") {
          const incGoal: GoalItem = changes.updatedGoals.slice(-1)[0];
          Object.keys(incGoal).forEach((key) => {
            if (!tags.includes(key) || incGoal[key] === showChangesModal[key]) {
              delete incGoal[key];
            }
          });
          await updateGoal(showChangesModal?.id, { ...showChangesModal, ...incGoal });
        }
        await cleanChangesOf(showChangesModal.id, show);
      } else if (show === "completedGoals") {
        if (choice === "accept") {
          await archiveUserGoal(showChangesModal);
        }
        await completeChanges(true, showChangesModal.id);
      }
      const tmp = [...activeChange.filter((ele) => ele !== show && changes[ele].length !== 0)];
      setActiveChange([...tmp]);
      if (tmp.length === 0) {
        if (show !== "deletedGoals") { await changeNewUpdatesStatus(false, showChangesModal.id); }
        setChanges(null);
        setShowChangesModal(null);
      }
    };
    const getAcceptBtn = () => (
      <button
        type="button"
        style={{ width: "100%", justifyContent: "flex-start" }}
        className={`default-btn${darkModeStatus ? "-dark" : ""}`}
        onClick={async () => { await handleChoice("accept"); }}
      >
        <img
          alt="add changes"
          src={show === "deletedGoals" ? trash : plus}
          width={25}
        />&nbsp;
        { show === "completedGoals" && "Complete for me too" }
        { show === "deletedGoals" && "Delete for me too" }
        { show === "subgoals" && "Add all checked" }
        { show === "updatedGoals" && "Make all checked changes" }
      </button>
    );
    const getIgnoreBtn = () => (
      <button
        type="button"
        style={{ backgroundColor: "rgba(115, 115, 115, 0.6)", width: "100%", justifyContent: "flex-start" }}
        className={`default-btn${darkModeStatus ? "-dark" : ""}`}
        onClick={async () => { await handleChoice("ignore"); }}
      >
        <img
          alt="add changes"
          src={ignore}
          width={25}
        />&nbsp;Ignore {show !== "completedGoals" && "all" }
      </button>
    );
    const getEditChangesList = () => {
      if (changes && show) {
        const incGoal: GoalItem = changes.updatedGoals.slice(-1)[0];
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
      const getOutbox = async () => {
        if (showChangesModal) {
          const res = await getDump(showChangesModal.shared?.relId, showChangesModal.id);
          if (res) {
            console.log(res);
            const tmp = [...activeChange.filter((ele) => res[ele].length !== 0)];
            setActiveChange([...tmp]);
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
          <h2>{ show && getMessage()}</h2>
          { show === "subgoals" && (
          <Form className={`changes-list${darkModeStatus ? "-dark" : ""}`}>
            { changes && show && changes[show].map((ele) => (
              <div key={`${ele.id}-subgoal`}>
                <Form.Check
                  checked
                  disabled
                  className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
                  name="group1"
                  type="checkbox"
                /> <p>&nbsp;{ele.title}</p>
              </div>
            ))}
          </Form>
          )}
          { show === "updatedGoals" && getEditChangesList() }
          { getAcceptBtn() }
          { getIgnoreBtn() }
        </Modal.Body>
      </Modal>
    );
  }
  return <div />;
};

export default DisplayChangesModal;
