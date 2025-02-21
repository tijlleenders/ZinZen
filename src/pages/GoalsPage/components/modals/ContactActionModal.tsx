import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@src/store";
import { useQueryClient } from "react-query";
import { deleteContact } from "@src/api/ContactsAPI";
import ContactItem from "@src/models/ContactItem";
import ZModal from "@src/common/ZModal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import EditContactModal from "./EditContactModal";

const ContactActionModal = ({ contact }: { contact: ContactItem }) => {
  const { t } = useTranslation();
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteContact = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await deleteContact(contact);
    setLastAction("partnersRevalidate");
    setShowToast({
      open: true,
      message: res.message,
      extra: "",
    });
    queryClient.invalidateQueries({ queryKey: ["partners"] });
    window.history.back();
  };

  return (
    <>
      {showEditModal && (
        <EditContactModal
          contact={contact}
          onClose={() => {
            setShowEditModal(false);
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            window.history.back();
          }}
        />
      )}
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

          <button type="button" className="goal-action-archive shareOptions-btn" onClick={() => setShowEditModal(true)}>
            <ActionDiv label={t("Edit")} icon="Edit" />
          </button>
        </div>
      </ZModal>
    </>
  );
};

export default ContactActionModal;
