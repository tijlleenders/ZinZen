import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

import { shareMyGoal } from "@src/api/GoalsAPI";

import addContactIcon from "@assets/images/addContact.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
import sharePublic from "@assets/images/sharePublic.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import copyLink from "@assets/images/copyLink.svg";

import ContactItem from "@src/models/ContactItem";
import { addContact, getAllContacts } from "@src/api/ContactsAPI";

import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { GoalItem } from "@src/models/GoalItem";

import "./ShareGoalModal.scss";

interface IShareGoalModalProps {
  goal: GoalItem
  showShareModal: number,
  setShowShareModal: React.Dispatch<React.SetStateAction<number>>
}

const ShareGoalModal : React.FC<IShareGoalModalProps> = ({ goal, showShareModal, setShowShareModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const handleCloseAddContact = () => setShowAddContactModal(false);
  const handleShowAddContact = () => setShowAddContactModal(true);

  const getContactBtn = (letter = "") => (
    <div className="contact-button">
      <button
        type="button"
        onClick={() => {
          if (letter === "") handleShowAddContact();
        }}
        className="contact-icon"
      >
        { letter === "" ? <img alt="add contact" src={addContactIcon} /> : letter[0]}
      </button>
      { letter !== "" && <p>{letter}</p> }
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
      id="share-modal"
      show={showShareModal !== -1}
      onHide={() => setShowShareModal(-1)}
      centered
      autoFocus={false}
    >
      <Modal.Body id="share-modal-body">
        <button
          onClick={async () => {
            await shareMyGoal(goal, "root");
          }}
          type="button"
          className="shareOptions-btn"
        >
          <div className="share-Options">
            <div> <img alt="share goal anonymously" src={shareAnonymous} /> </div>
            <p className="shareOption-name">Share Anonymously</p>
          </div>
        </button>
        <button type="button" className="shareOptions-btn">
          <div className="share-Options">
            <div> <img alt="share goal public" src={sharePublic} /> </div>
            <p className="shareOption-name">Share Public</p>
          </div>
        </button>
        <button type="button" className="shareOptions-btn">
          <div className="share-Options">
            <div> <img alt="share with friend" src={shareWithFriend} /> </div>
            <p className="shareOption-name">Share 1:1</p>
          </div>
          <div className="shareWithContacts">
            {contacts.length === 0 &&
              <p className="share-warning"> You don&apos;t have a contact yet.<br />Add one! </p>}
            <div id="contact-list">
              { contacts.length > 0 && contacts.map((ele) => (getContactBtn(ele.name))) }
              { getContactBtn() }
            </div>
          </div>
        </button>
      </Modal.Body>
      <Modal
        id="addContact-modal"
        show={showAddContactModal}
        onHide={handleCloseAddContact}
        centered
        autoFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className={darkModeStatus ? "note-modal-title-dark" : "note-modal-title-light"}>
            Add a contact name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            placeholder="Name"
            className="show-feelings__note-input"
            value={newContactName}
            onChange={(e) => {
              setNewContactName(e.target.value);
            }}
              // Admittedly not the best way to do this but suffices for now
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setNewContactName("");
                handleCloseAddContact();
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={async () => {
              navigator.clipboard.writeText("dummyRelationshipId");
              await addContact(newContactName);
              setNewContactName("");
              handleCloseAddContact();
            }}
            className="addContact-submit-button"
          >
            <img alt="add contact" src={copyLink} />Copy Link
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default ShareGoalModal;
