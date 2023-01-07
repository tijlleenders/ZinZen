import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";

import copyLink from "@assets/images/copyLink.svg";
import { darkModeState, displayToast } from "@src/store";
import { collaborateWithContact, getRelationshipStatus, shareGoalWithContact, updateStatusOfContact } from "@src/api/ContactsAPI";
import { updateColabStatusOfGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { getDefaultValueOfCollab } from "@src/utils";

interface IInviteLinkModalProps {
  showInviteModal: { goal: GoalItem, id: string, name: string, relId: string, accepted: boolean } | null,
  setShowInviteModal: React.Dispatch<React.SetStateAction<{ name: string, relId: string } | null>>
}

const InviteLinkModal : React.FC<IInviteLinkModalProps> = ({ showInviteModal, setShowInviteModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [accepted, setAccepted] = useState(true);
  const setShowToast = useSetRecoilState(displayToast);

  useEffect(() => {
    const checkStatus = async () => {
      if (showInviteModal && !showInviteModal.accepted) {
        const res = await getRelationshipStatus(showInviteModal.relId);
        if (res.success) {
          await updateStatusOfContact(showInviteModal.relId, res.response.status !== "pending");
          setAccepted(res.response.status !== "pending");
        }
      } else { setAccepted(true); }
    };
    checkStatus();
  }, []);
  return (
    <Modal
      className={`addContact-modal popupModal${darkModeStatus ? "-dark" : ""}`}
      show={!!showInviteModal}
      onHide={() => {
        setShowInviteModal(null);
      }}
      centered
      autoFocus={false}
    >
      <Modal.Body>
        <p className="popupModal-title"> Share 1:1 with {showInviteModal?.name} </p>
        <button
          disabled={!accepted}
          style={{ width: "100%" }}
          className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
          type="submit"
          onClick={async () => {
            if (showInviteModal) {
              const { goal, relId, name } = showInviteModal;
              // setLoading(true);
              if (!goal.shared && ["none", "declined"].includes(goal.collaboration.status)) {
                goal.collaboration = getDefaultValueOfCollab();
                await shareGoalWithContact(relId, goal);
                await updateSharedStatusOfGoal(goal.id, { relId, name, allowed: false });
              }
              setShowInviteModal(null);
              // setLoading(false);
            }
          }}
        >
          Send a copy<img alt="add contact" src={copyLink} />
        </button>
        <button
          disabled={!accepted}
          style={{ width: "100%" }}
          className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
          type="submit"
          onClick={async () => {
            if (showInviteModal) {
              const { goal, relId, name } = showInviteModal;
              if (goal.collaboration.allowed && (!goal.shared || (goal.shared && goal.shared.allowed))) {
                await collaborateWithContact(relId, goal);
                const colabObject: ICollaboration = {
                  relId,
                  name,
                  rootGoal: goal.id,
                  allowed: false,
                  newUpdates: false,
                  status: "pending",
                  notificationCounter: 0,
                };
                await updateColabStatusOfGoal(goal.id, colabObject);
                setShowInviteModal(null);
              }
            }
          }}
        >
          Invite to collaborate<img alt="add contact" src={copyLink} />
        </button>
        <button
          style={{ width: "100%" }}
          className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
          type="submit"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/invite/${showInviteModal?.relId}`);
            setShowToast({ open: true, message: "Link copied to clipboard", extra: `Send this link to ${showInviteModal?.name} so that they can add you in their contacts` });
          }}
        >
          Invite {showInviteModal?.name}<img alt="add contact" src={copyLink} />
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default InviteLinkModal;
