import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";

import copyLink from "@assets/images/copyLink.svg";
import { darkModeState, displayToast } from "@src/store";
import { getRelationshipStatus, shareGoalWithContact, updateStatusOfContact } from "@src/api/ContactsAPI";
import { updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

interface IInviteLinkModalProps {
  showInviteModal: { goal: GoalItem, id: string, name: string, relId: string, accepted: boolean } | null,
  setShowInviteModal: React.Dispatch<React.SetStateAction<{ name: string, relId: string } | null>>
}

const InviteLinkModal : React.FC<IInviteLinkModalProps> = ({ showInviteModal, setShowInviteModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [accepted, setAccepted] = useState(false);
  const setShowToast = useSetRecoilState(displayToast);

  useEffect(() => {
    const checkStatus = async () => {
      if (showInviteModal && !showInviteModal.accepted) {
        const res = await getRelationshipStatus(showInviteModal.relId);
        if (res.success) {
          await updateStatusOfContact(showInviteModal.id, res.response.status !== "pending");
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
              await shareGoalWithContact(relId, { id: goal.id, title: goal.title });
              await updateSharedStatusOfGoal(goal.id, relId, name);
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
