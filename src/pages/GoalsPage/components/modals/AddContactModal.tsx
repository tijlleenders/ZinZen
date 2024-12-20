/* eslint-disable jsx-a11y/no-autofocus */
import { addContact } from "@src/api/ContactsAPI";
import { shareInvitation } from "@src/assets";
import Loader from "@src/common/Loader";
import { initRelationship } from "@src/services/contact.service";
import { displayToast } from "@src/store";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import ZModal from "@src/common/ZModal";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import DefaultButton from "@src/common/DefaultButton";

const AddContactModal = () => {
  const [loading, setLoading] = useState(false);
  const [newContact, setNewContact] = useState<{ contactName: string; relId: string } | null>(null);

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
          const defaultPartner = localStorage.getItem(LocalStorageKeys.DEFAULT_PARTNER);
          if (!defaultPartner) {
            localStorage.setItem(LocalStorageKeys.DEFAULT_PARTNER, relId);
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
        window.history.back();
      });
    }
    setLoading(false);
  };
  return (
    <ZModal type="addContact-modal" open>
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
      <DefaultButton
        id="addContact-btn"
        disabled={loading || newContact?.contactName === ""}
        onClick={async () => {
          await addNewContact();
        }}
        customStyle={{ marginTop: 0, alignSelf: "flex-end" }}
      >
        {loading ? (
          <Loader />
        ) : (
          <img
            alt="add contact"
            style={{ marginRight: 0, height: 20, width: 20 }}
            className="theme-icon"
            src={shareInvitation}
          />
        )}

        <span>Share invitation</span>
      </DefaultButton>
    </ZModal>
  );
};

export default AddContactModal;
