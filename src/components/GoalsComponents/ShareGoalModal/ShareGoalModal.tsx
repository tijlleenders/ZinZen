import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import addContactIcon from "@assets/images/addContact.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
import sharePublic from "@assets/images/sharePublic.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import copyLink from "@assets/images/copyLink.svg";

import ContactItem from "@src/models/ContactItem";
import { addContact, getAllContacts, initRelationship, shareGoalWithContact } from "@src/api/ContactsAPI";
import { darkModeState, displayLoader } from "@src/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { getGoal, shareMyGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";

import "./ShareGoalModal.scss";

interface IShareGoalModalProps {
  goal: GoalItem
  showShareModal: number,
  setShowShareModal: React.Dispatch<React.SetStateAction<number>>
}

const ShareGoalModal : React.FC<IShareGoalModalProps> = ({ goal, showShareModal, setShowShareModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLoading = useSetRecoilState(displayLoader);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [displayContacts, setDisplayContacts] = useState(false);

  const handleCloseAddContact = () => setShowAddContactModal(false);
  const handleShowAddContact = () => setShowAddContactModal(true);

  const getContactBtn = (relId = "", letter = "") => (
    <div className="contact-button">
      <button
        type="button"
        onClick={async () => {
          if (letter === "") handleShowAddContact();
          else {
            setLoading(true);
            await shareGoalWithContact(relId, { id: goal.id, title: goal.title });
            await updateSharedStatusOfGoal(goal.id, relId, letter);
            setShowShareModal(-1);
            setLoading(false);
          }
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
      id={`share-modal${darkModeStatus ? "-dark" : ""}`}
      show={showShareModal !== -1}
      onHide={() => setShowShareModal(-1)}
      centered
      autoFocus={false}
    >
      <Modal.Body id="share-modal-body">
        <button
          onClick={async () => {
            let parentGoal = "root";
            setLoading(true);
            if (goal.parentGoalId !== "root") {
              parentGoal = (await getGoal(goal.parentGoalId)).title;
            }
            await shareMyGoal(goal, parentGoal);
            setLoading(false);
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
        <button disabled={!!goal.shared} type="button" className="shareOptions-btn">
          <div className="share-Options" onClickCapture={() => setDisplayContacts(!displayContacts)}>
            <div> <img alt="share with friend" src={shareWithFriend} /> </div>
            <p className="shareOption-name">{`Share 1:1 ${goal.shared ? ` - Goal is shared with ${goal.shared.name}` : " "}`}</p>
          </div>
          { !goal.shared && displayContacts && (
            <div className="shareWithContacts">
              {contacts.length === 0 &&
                <p className="share-warning"> You don&apos;t have a contact yet.<br />Add one! </p>}
              { contacts.length > 0 &&
                <p className="share-warning"> Don&apos;t Worry. <br /> We will soon allow our users to add more than 1 contact </p>}
              <div id="modal-contact-list" style={contacts.length < 3 ? { justifyContent: "flex-start" } : {}}>
                { contacts.length > 0 &&
                  contacts.slice(0, Math.min(3, contacts.length)).map((ele) => (
                    getContactBtn(ele.relId, ele.name)
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
                { contacts.length < 1 && getContactBtn() }
              </div>
            </div>
          )}
        </button>
        <Form.Check type="checkbox" className="shareOptions-btn" id="cb-withTime">
          <Form.Check.Input type="checkbox" />
          <Form.Check.Label>Share with time</Form.Check.Label>
        </Form.Check>
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
              const res = await initRelationship();
              if (res.success) {
                await addContact(newContactName, res.response?.relId, res.response?.installId);
                navigator.clipboard.writeText(`${window.location.origin}/invite/${res.response?.relId}`);
                setNewContactName("");
                handleCloseAddContact();
              }
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
