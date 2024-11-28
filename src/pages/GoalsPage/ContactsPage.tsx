import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteContact, getAllContacts } from "@src/api/ContactsAPI";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout";
import ContactItem from "@src/models/ContactItem";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import ZModal from "@src/common/ZModal";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { displayToast, lastAction } from "@src/store";
import { useTranslation } from "react-i18next";
import EditContactModal from "@components/ContactsComponents/EditContactModal";

const Actions = ({ contact }: { contact: ContactItem }) => {
  const { t } = useTranslation();
  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      {showEditModal && (
        <EditContactModal
          contact={contact}
          onClose={() => {
            setShowEditModal(false);
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
          <button
            type="button"
            className="goal-action-archive shareOptions-btn"
            onClick={async (e) => {
              e.stopPropagation();
              const res = await deleteContact(contact.id);
              if (res.success) {
                setLastAction("contactDeleted");
                setShowToast({
                  open: true,
                  message: res.message,
                  extra: "",
                });
              }
              window.history.back();
            }}
          >
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

const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [searchParams] = useSearchParams();
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const showOptions = searchParams.get("showOptions") === "true" && selectedContact;

  useEffect(() => {
    setSelectedContact(null);
  }, []);

  const action = useRecoilValue(lastAction);

  useEffect(() => {
    getAllContacts().then((fetchedContacts) => {
      setContacts(fetchedContacts);
    });
  }, [action]);

  return (
    <AppLayout title="contacts" debounceSearch={() => {}}>
      {showOptions && <Actions contact={selectedContact} />}
      <div className="myGoals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts.map((contact) => (
              <Contacts key={contact.id} contact={contact} setSelectedContact={setSelectedContact} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
