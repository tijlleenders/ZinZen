/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import ZModal from "@src/common/ZModal";
import { displayToast } from "@src/store";
import useVirtualKeyboardOpen from "@src/hooks/useVirtualKeyBoardOpen";
import useOnScreenKeyboardScrollFix from "@src/hooks/useOnScreenKeyboardScrollFix";
import { useNavigate, useParams } from "react-router-dom";
import { usePartnerContext } from "@src/contexts/partner-context";
import { useUpdateContact } from "@src/hooks/api/Contacts/mutations/useUpdateContact";
import DefaultButton from "@src/common/DefaultButton";

const EditContactModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);

  const { partnerId } = useParams();
  const { partner: contact } = usePartnerContext();

  const { updateContactMutation, isLoading } = useUpdateContact();

  const [name, setName] = useState("");
  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  useEffect(() => {
    if (contact) {
      setName(contact.name);
    }
  }, [contact]);

  if (!partnerId || !contact) {
    return null;
  }

  const handleUpdateContact = async () => {
    if (name.trim().length === 0) {
      setShowToast({
        open: true,
        message: "Contact name cannot be empty",
        extra: "Please enter a valid name",
      });
      return;
    }

    if (name.trim() === contact?.name) {
      return;
    }

    try {
      await updateContactMutation({ ...contact, name: name.trim() });
    } catch (err) {
      console.error("Error updating contact", err);
    } finally {
      navigate("/partners");
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
      onCancel={() => navigate("/partners")}
    >
      <p className="popupModal-title">Edit contact name</p>
      <input
        type="text"
        autoFocus
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("Enter contact name")}
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
