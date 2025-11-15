import React from "react";
import { useTranslation } from "react-i18next";
import ZModal from "@src/common/ZModal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { Link } from "@tanstack/react-router";
import ContactItem from "@src/models/ContactItem";
import { useDeleteContact } from "@src/hooks/api/Contacts/mutations/useDeleteContact";

const ContactActionModal = ({ contact }: { contact: ContactItem }) => {
  const { t } = useTranslation();

  const { deleteContactMutation } = useDeleteContact(contact.id);

  const handleDeleteContact = async () => {
    try {
      deleteContactMutation();
    } finally {
      window.history.back();
    }
  };

  if (!contact) {
    return null;
  }

  return (
    <ZModal open width={400} type="interactables-modal">
      <div style={{ textAlign: "left" }} className="header-title">
        <p className="ordinary-element" id="title-field">
          {contact.name}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <button type="button" className="goal-action-archive shareOptions-btn" onClick={handleDeleteContact}>
          <ActionDiv label={t("Delete")} icon="Delete" />
        </button>
        <Link
          to="/partners/$partnerId"
          replace
          search={{ mode: "edit", type: "contact" }}
          params={{ partnerId: contact.id }}
          className="goal-action-archive shareOptions-btn"
        >
          <ActionDiv label={t("Edit")} icon="Edit" />
        </Link>
      </div>
    </ZModal>
  );
};

export default ContactActionModal;
