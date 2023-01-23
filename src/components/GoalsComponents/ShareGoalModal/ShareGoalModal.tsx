import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import addContactIcon from "@assets/images/addContact.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
// import sharePublic from "@assets/images/sharePublic.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import copyLink from "@assets/images/copyLink.svg";

import ContactItem from "@src/models/ContactItem";
import { addContact, getAllContacts, updateStatusOfContact } from "@src/api/ContactsAPI";
import { darkModeState, displayToast } from "@src/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { getGoal, shareMyGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { getRelationshipStatus, initRelationship, shareGoalWithContact } from "@src/services/contact.service";
import { addSubInPub } from "@src/api/PubSubAPI";

import "./ShareGoalModal.scss";
import Loader from "@src/common/Loader";
import { convertIntoSharedGoal } from "@src/helpers/GoalProcessor";
import InviteLinkModal from "./InviteLinkModal";

interface IShareGoalModalProps {
  goal: GoalItem
  showShareModal: string,
  setShowShareModal: React.Dispatch<React.SetStateAction<string>>
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
        style={name === "" || accepted ? {} : { background: "#DFDFDF", color: "#979797" }}
        onClick={async () => {
          setLoading({ ...loading, S: true });
          if (name === "") handleShowAddContact();
          else {
            const status = accepted ? true : await checkStatus(relId);
            if (goal.typeOfGoal === "myGoal" && status) {
              await shareGoalWithContact(relId, convertIntoSharedGoal(goal));
              setShowToast({ open: true, message: `Cheers!!, Your goal is shared with ${name}`, extra: "" });
              updateSharedStatusOfGoal(goal.id, name).then(() => console.log("status updated"));
              addSubInPub(goal.id, relId, "shared").then(() => console.log("subscriber added"));
            } else {
              navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
              setShowToast({ open: true, message: "Link copied to clipboard", extra: `Your invite hasn't been accepted yet. Send this link to ${name} so that they can add you in their contacts` });
            }
          }
          setLoading({ ...loading, S: false });
        }}
        className="contact-icon"
      >
        { name === "" ? <img alt="add contact" src={addContactIcon} /> : name[0]}
      </button>
      { name !== "" && <p style={{ margin: 0 }}>{name}</p> }
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
      show={showShareModal !== ""}
      onHide={() => setShowShareModal("")}
      centered
      autoFocus={false}
      style={showAddContactModal || showInviteModal ? { zIndex: 1 } : {}}
    >
      <Modal.Body id="share-modal-body">
        <h4>Share Goals</h4>
        <button
          onClick={async () => {
            let parentGoalTitle = "root";
            setLoading({ ...loading, A: true });
            if (goal.parentGoalId !== "root") { parentGoalTitle = (await getGoal(goal.parentGoalId)).title; }
            const { response } = await shareMyGoal(goal, parentGoalTitle);
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
        {/* <button type="button" className="shareOptions-btn">
          <div className="share-Options">
            <div> <img alt="share goal public" src={sharePublic} /> </div>
            <p className="shareOption-name">Share Public</p>
            { loading.P && <Loader /> }
          </div>
        </button> */}
        <button
          disabled={goal.typeOfGoal !== "myGoal"}
          type="button"
          onClick={() => setDisplayContacts(!displayContacts)}
          className="shareOptions-btn"
        >
          <div className="share-Options">
            <div> <img alt="share with friend" src={shareWithFriend} /> </div>
            <p className="shareOption-name">
              Share 1:1 <br />
              {goal.typeOfGoal === "shared" && ` - Goal is shared with ${goal.shared.contacts[0]}`}
              {goal.typeOfGoal === "collaboration" && ` - Goal is in collaboration with ${goal.collaboration.collaborators[0]}`}
            </p>
            { loading.S && <Loader /> }
          </div>
          { (goal.typeOfGoal === "myGoal") && displayContacts && (
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
