/* eslint-disable jsx-a11y/no-autofocus */
import { addContact } from "@src/api/ContactsAPI";
import { shareInvitation } from "@src/assets";
import Loader from "@src/common/Loader";
import { initRelationship } from "@src/services/contact.service";
import { darkModeState, displayToast } from "@src/store";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ZModal from "@src/common/ZModal";

interface AddContactModalProps {
  showAddContactModal: boolean;
}
const AddContactModal: React.FC<AddContactModalProps> = ({ showAddContactModal }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [loading, setLoading] = useState(false);
  const [newContact, setNewContact] = useState<{ contactName: string; relId: string } | null>(null);
  const handleCloseAddContact = () => {
    window.history.back();
  };
  const setShowToast = useSetRecoilState(displayToast);

  const addNewContact = async () => {
    let link = "";
    setLoading(true);
    if (newContact) {
      if (newContact.relId === "") {
        const res = await initRelationship();
        if (res.success && res.response.relId && res.response.relId.length > 0) {
          const { relId } = res.response;
          await addContact(newContact?.contactName, relId, "sender");
          setNewContact({ ...newContact, relId });
          const defaultPartner = localStorage.getItem("defaultPartner");
          if (!defaultPartner) {
            localStorage.setItem("defaultPartner", relId);
          }
          link = `${window.location.origin}/invite/${res.response.relId}`;
        } else {
          setShowToast({
            open: true,
            message: "Sorry, we are unable to create new contact",
            extra: "Please submit you query via feedback if this issue persist",
          });
        }
      } else {
        link = `${window.location.origin}/invite/${newContact?.relId}`;
      }
    } else {
      setShowToast({ open: true, message: "Please give a name to this contact", extra: "" });
    }
    if (link !== "") {
      navigator.share({ text: link }).then(() => {
        setNewContact(null);
        handleCloseAddContact();
      });
    }
    setLoading(false);
  };
  return (
    <ZModal
      type="addContact-modal"
      open={showAddContactModal}
      onCancel={() => {
        setNewContact(null);
        handleCloseAddContact();
      }}
    >
      <p className="popupModal-title"> Add a contact name </p>
      <input
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
        disabled={loading}
        id="addContact-btn"
        onClick={async () => {
          await addNewContact();
        }}
        className={`addContact-btn action-btn submit-icon${darkModeStatus ? "-dark" : ""}`}
      >
        {loading ? <Loader /> : <img alt="add contact" className="theme-icon" src={shareInvitation} />}
        <span style={loading ? { marginLeft: 28 } : {}}>Share invitation</span>
      </button>
    </ZModal>
  );
};

export default AddContactModal;
