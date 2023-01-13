import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import addContactIcon from "@assets/images/addContact.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
import sharePublic from "@assets/images/sharePublic.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import copyLink from "@assets/images/copyLink.svg";

import ContactItem from "@src/models/ContactItem";
import { addContact, getAllContacts, getRelationshipStatus, initRelationship, shareGoalWithContact, updateStatusOfContact } from "@src/api/ContactsAPI";
import { darkModeState, displayToast } from "@src/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { getGoal, shareMyGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";

import "./ShareGoalModal.scss";
import Loader from "@src/common/Loader";
import InviteLinkModal from "./InviteLinkModal";

interface IShareGoalModalProps {
  goal: GoalItem
  showShareModal: number,
  setShowShareModal: React.Dispatch<React.SetStateAction<number>>
}

const ShareGoalModal : React.FC<IShareGoalModalProps> = ({ goal, showShareModal, setShowShareModal }) => {
  const minContacts = 1;
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [newContact, setNewContact] = useState<{ contactName: string, relId: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState<{ goal: GoalItem, id: string, name: string, relId: string, accepted: boolean } | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [displayContacts, setDisplayContacts] = useState(false);
  const [loading, setLoading] = useState({ P: false, A: false, S: false });

  const handleCloseAddContact = () => setShowAddContactModal(false);
  const handleShowAddContact = () => setShowAddContactModal(true);

  const checkStatus = async (relId: string) => {
    if (relId === "") { return false; }
    const res = await getRelationshipStatus(relId);
    if (res.success) {
      await updateStatusOfContact(relId, res.response.status !== "pending");
      return res.response.status !== "pending";
    }
    return false;
  };
  const getContactBtn = (relId = "", name = "", accepted = false) => (
    <div className="contact-button">
      <button
        type="button"
        onClick={async () => {
          setLoading({ ...loading, S: true });
          if (name === "") handleShowAddContact();
          else {
            const status = accepted ? true : await checkStatus(relId);
            if (!goal.shared && status) {
              await shareGoalWithContact(relId, goal);
              await updateSharedStatusOfGoal(goal.id, { relId, name, allowed: false });
              setShowToast({ open: true, message: `Cheers!!, Your goal is shared with ${name}`, extra: "" });
            } else {
              navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
              setShowToast({ open: true, message: "Link copied to clipboard", extra: `Send this link to ${name} so that they can add you in their contacts` });
            }
          }
          setLoading({ ...loading, S: false });
        }}
        className="contact-icon"
      >
        { name === "" ? <img alt="add contact" src={addContactIcon} /> : name[0]}
      </button>
      { name !== "" && <p>{name}</p> }
    </div>
  );

  useEffect(() => {
    (async () => {
      const tmp = await getAllContacts();
      setContacts([...tmp]);
    })();
  }, [showAddContactModal]);

  return (
    <Modal
      id={`share-modal${darkModeStatus ? "-dark" : ""}`}
      show={showShareModal !== -1}
      onHide={() => setShowShareModal(-1)}
      centered
      autoFocus={false}
      style={showAddContactModal || showInviteModal ? { zIndex: 1 } : {}}
    >
      <Modal.Body id="share-modal-body">
        <h4>Share Goals</h4>
        <button
          onClick={async () => {
            let parentGoal = "root";
            setLoading({ ...loading, A: true });
            if (goal.parentGoalId !== "root") { parentGoal = (await getGoal(goal.parentGoalId)).title; }
            const { response } = await shareMyGoal(goal, parentGoal);
            setShowToast({ open: true, message: response, extra: "" });
            setLoading({ ...loading, A: false });
          }}
          type="button"
          className="shareOptions-btn"
        >
          <div className="share-Options">
            <div> <img alt="share goal anonymously" src={shareAnonymous} /> </div>
            <p className="shareOption-name">Share Anonymously</p>
            { loading.A && <Loader /> }
          </div>
        </button>
        <button type="button" className="shareOptions-btn">
          <div className="share-Options">
            <div> <img alt="share goal public" src={sharePublic} /> </div>
            <p className="shareOption-name">Share Public</p>
            { loading.P && <Loader /> }
          </div>
        </button>
        <button
          disabled={!!goal.shared || goal.collaboration.status !== "none"}
          type="button"
          onClick={() => setDisplayContacts(!displayContacts)}
          className="shareOptions-btn"
        >
          <div className="share-Options">
            <div> <img alt="share with friend" src={shareWithFriend} /> </div>
            <p className="shareOption-name">
              Share 1:1 <br />
              { goal.collaboration.status === "accepted" ?
                ` - Goal is collaborated with ${goal.collaboration?.name}` :
                goal.collaboration.status === "pending" ?
                  " - Goal collaboration invite is not yet accepted"
                  :
                  ""}
              {`${goal.shared && goal.collaboration.status === "none" ? ` - Goal is shared with ${goal.shared.name}` : ""}`}
            </p>
            { loading.S && <Loader /> }
          </div>
          { (!goal.shared || !goal.collaboration.status) && displayContacts && (
            <div className="shareWithContacts">
              {contacts.length === 0 &&
                <p className="share-warning"> You don&apos;t have a contact yet.<br />Add one! </p>}
              { contacts.length > 0 &&
                <p className="share-warning"> Don&apos;t Worry. <br /> We will soon allow our users to add more than 1 contact </p>}
              <div id="modal-contact-list" style={contacts.length <= minContacts ? { justifyContent: "flex-start" } : {}}>
                { contacts.length > 0 &&
                  contacts.slice(0, Math.min(minContacts, contacts.length)).map((ele) => (
                    getContactBtn(ele.relId, ele.name, ele.accepted)
                  ))}
                { /* contacts.length >= 3 && (
                  <div className="contact-button">
                    <button
                      type="button"
                      className="next-icon"
                      onClick={() => navigate("/contacts")}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                ) */}
                { contacts.length === 0 && getContactBtn() }
              </div>
            </div>
          )}
        </button>
      </Modal.Body>
      <Modal
        className={`addContact-modal popupModal${darkModeStatus ? "-dark" : ""}`}
        show={showAddContactModal}
        onHide={() => {
          setNewContact(null);
          handleCloseAddContact();
        }}
        centered
        autoFocus={false}
      >
        <Modal.Body>
          <p className="popupModal-title"> Add a contact name </p>
          <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            disabled={newContact ? newContact.relId !== "" : false}
            type="text"
            placeholder="Name"
            className="show-feelings__note-input"
            value={newContact?.contactName || ""}
            onChange={(e) => {
              setNewContact({ contactName: e.target.value, relId: newContact?.relId || "" });
            }}
              // Admittedly not the best way to do this but suffices for now
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setNewContact(null);
                handleCloseAddContact();
              }
            }}
          />
          <button
            type="submit"
            onClick={async () => {
              if (newContact && newContact.relId === "") {
                const res = await initRelationship();
                if (res.success) {
                  await addContact(newContact?.contactName, res.response?.relId);
                  setNewContact({ ...newContact, relId: res.response?.relId });
                  navigator.clipboard.writeText(`${window.location.origin}/invite/${res.response?.relId}`);
                }
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/invite/${newContact?.relId}`);
              }
              setShowToast({ open: true, message: "Link copied to clipboard", extra: `Send this link to ${newContact?.contactName} so that they can add you in their contacts` });
            }}
            className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
          >
            <img alt="add contact" src={copyLink} />Add Contact
          </button>
        </Modal.Body>
      </Modal>
      { showInviteModal && <InviteLinkModal showInviteModal={showInviteModal} setShowInviteModal={setShowInviteModal} /> }

    </Modal>
  );
};

export default ShareGoalModal;
