import { addContact } from "@src/api/ContactsAPI";
import { initRelationship } from "@src/services/contact.service";
import { darkModeState } from "@src/store";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

const shareInvitation = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA30lEQVR4nOXUvUoDQRTF8d9WEay20EKbNH5EfKBY2FrrY/gAEXwFG+0FU9ha2oakiWin+ADKwBWmWNlZXUH0wIHhnnv/MMwH5VrHmp61gwc8Yb9v6Fu4F/gIj1jgPryIWsq+rDPMMcR1eBi1yXfAK1iN9QdY1FLWWZs4xBEGDeBBZKlnoxS6h5fssOoGcJ3lz9gtAZ/iFVsBqBrAVWTb0ZtmWnWOWUM9B+eaxcw/Al/h8ifAdXZDegV/pj8MnmDZAbws/ZAO4qne4KLF0+gdl4ArnOAWdy1OPccddveL9Q7lolSRwSaqJAAAAABJRU5ErkJggg==";

interface AddContactModalProps {
    showAddContactModal: boolean
    setShowAddContactModal: React.Dispatch<React.SetStateAction<boolean>>
}
const AddContactModal: React.FC<AddContactModalProps> = ({ showAddContactModal, setShowAddContactModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
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
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await addNewContact();
            }
          }}
        />
        <button
          type="button"
          onClick={async () => { await addNewContact(); }}
          className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
        >
          <img alt="add contact" src={shareInvitation} />Share invitation
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default AddContactModal;
