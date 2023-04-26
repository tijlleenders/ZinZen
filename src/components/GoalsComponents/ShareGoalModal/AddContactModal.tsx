import { addContact } from "@src/api/ContactsAPI";
import { shareInvitation } from "@src/assets";
import { initRelationship } from "@src/services/contact.service";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

interface AddContactModalProps {
    showAddContactModal: boolean
    setShowAddContactModal: React.Dispatch<React.SetStateAction<boolean>>
}
const AddContactModal: React.FC<AddContactModalProps> = ({ showAddContactModal, setShowAddContactModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeState);
  const [newContact, setNewContact] = useState<{ contactName: string, relId: string } | null>(null);
  const handleCloseAddContact = () => setShowAddContactModal(false);

  const addNewContact = async () => {
    let link = "";
    if (newContact && newContact.relId === "") {
      const res = await initRelationship();
      if (res.success) {
        await addContact(newContact?.contactName, res.response?.relId);
        setNewContact({ ...newContact, relId: res.response?.relId });
        link = `${window.location.origin}/invite/${newContact?.relId}`;
      }
    } else {
      link = `${window.location.origin}/invite/${newContact?.relId}`;
    }
    if (link !== "") {
      navigator.share({ text: link }).then(() => {
        setNewContact(null);
        handleCloseAddContact();
      });
    }
  };
  return (

    <Modal
      className={`addContact-modal popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
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
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await addNewContact();
            }
          }}
        />
        <br />
        <button
          type="button"
          onClick={async () => { await addNewContact(); }}
          style={{ float: "right" }}
          className={`action-btn submit-icon${darkModeStatus ? "-dark" : ""}`}
        >
          <img alt="add contact" className="theme-icon" src={shareInvitation} />Share invitation
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default AddContactModal;
