/* eslint-disable jsx-a11y/no-autofocus */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import ZModal from "@src/common/ZModal";
import { displayToast, lastAction } from "@src/store";
import ContactItem from "@src/models/ContactItem";
import { updateContact } from "@src/api/ContactsAPI";
import plingSound from "@assets/pling.mp3";
import useVirtualKeyboardOpen from "@src/hooks/useVirtualKeyBoardOpen";
import useOnScreenKeyboardScrollFix from "@src/hooks/useOnScreenKeyboardScrollFix";

interface EditContactModalProps {
  contact: ContactItem;
  onClose: () => void;
}

const EditContactModal = ({ contact, onClose }: EditContactModalProps) => {
  const { t } = useTranslation();
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const editSound = new Audio(plingSound);

  const [name, setName] = useState(contact.name);
  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  const handleSave = async () => {
    if (name.trim().length) {
      try {
        const res = await updateContact(contact.id, { ...contact, name: name.trim() });
        editSound.play();
        setLastAction("contactEdited");
        setShowToast({
          open: true,
          message: res.message,
          extra: "",
        });
        onClose();
      } catch (error) {
        setShowToast({
          open: true,
          message: "Failed to update contact name",
          extra: "Please try again",
        });
      }
    } else {
      setShowToast({
        open: true,
        message: "Contact name cannot be empty",
        extra: "",
      });
    }
  };

  return (
    <ZModal
      type="addContact-modal"
      open
      style={{
        transform: `translate(0, ${isKeyboardOpen ? "-45%" : "0"})`,
        transition: "transform 0.3s ease-in-out",
      }}
      onCancel={onClose}
    >
      <p className="popupModal-title">Edit contact name</p>
      <input
        type="text"
        autoFocus
        className="show-feelings__note-input"
        style={{
          padding: "8px 12px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid var(--border-color)",
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await handleSave();
          }
        }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("Enter contact name")}
      />

      <br />
      <button
        type="button"
        id="addContact-btn"
        onClick={async () => {
          await handleSave();
        }}
        className="addContact-btn action-btn submit-icon"
      >
        <span>Save</span>
      </button>
    </ZModal>
  );
};

export default EditContactModal;
