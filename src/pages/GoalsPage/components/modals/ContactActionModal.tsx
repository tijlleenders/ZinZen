import React from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import ZModal from "@src/common/ZModal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPartnerById } from "@src/hooks/api/Contacts/useGetPartnerById";
import { useDeleteContact } from "@src/hooks/api/Contacts/useDeleteContact";

const ContactActionModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setShowToast = useSetRecoilState(displayToast);

  const { partnerId } = useParams();

  if (!partnerId) {
    return null;
  }

  const { error: getContactError, contact } = useGetPartnerById(partnerId);

  const { deleteContactMutation } = useDeleteContact(partnerId);

  const handleDeleteContact = async () => {
    try {
      await deleteContactMutation();
      setShowToast({
        open: true,
        message: "Contact deleted successfully",
        extra: "",
      });
    } catch (err) {
      setShowToast({
        open: true,
        message: "Error deleting contact",
        extra: "",
      });
    } finally {
      window.history.back();
    }
  };

  if (!contact) {
    return null;
  }

  if (getContactError) {
    setShowToast({
      open: true,
      message: "Error fetching contact",
      extra: "",
    });
  }

  const handleEditContactClick = () => {
    navigate(`/partners/${partnerId}/?mode=edit`, { replace: true });
  };

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

        <button type="button" className="goal-action-archive shareOptions-btn" onClick={handleEditContactClick}>
          <ActionDiv label={t("Edit")} icon="Edit" />
        </button>
      </div>
    </ZModal>
  );
};

export default ContactActionModal;
