/* eslint-disable jsx-a11y/no-autofocus */

import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import ZModal from "@src/common/ZModal";
import { displayToast } from "@src/store";
import useVirtualKeyboardOpen from "@src/hooks/useVirtualKeyBoardOpen";
import useOnScreenKeyboardScrollFix from "@src/hooks/useOnScreenKeyboardScrollFix";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateContact } from "@src/hooks/api/Contacts/mutations/useUpdateContact";
import DefaultButton from "@src/common/DefaultButton";
import ContactItem from "@src/models/ContactItem";

const EditContactModal = ({ contact }: { contact: ContactItem }) => {
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);
  const [contactName, setContactName] = useState(contact.name);
  const { updateContactMutation, isLoading } = useUpdateContact();

  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  const handleUpdateContact = async () => {
    if (contactName.trim().length === 0) {
      setShowToast({
        open: true,
        message: "Contact name cannot be empty",
        extra: "Please enter a valid name",
      });
      return;
    }

    if (contactName.trim() === contact.name) {
      return;
    }

    try {
      await updateContactMutation({ ...contact, name: contactName.trim() });
    } catch (err) {
      console.error("Error updating contact", err);
    } finally {
      navigate({ to: "/partners" });
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
      onCancel={() => navigate({ to: "/partners" })}
    >
      <p className="popupModal-title">Edit contact name</p>
      <input
        type="text"
        autoFocus
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid var(--border-color)",
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await handleUpdateContact();
          }
        }}
        disabled={isLoading}
      />
      <br />
      <DefaultButton customStyle={{ alignSelf: "end" }} onClick={handleUpdateContact}>
        Save
      </DefaultButton>
    </ZModal>
  );
};

export default EditContactModal;
