import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllContacts } from "@src/api/ContactsAPI";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout";
import ContactItem from "@src/models/ContactItem";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import ZModal from "@src/common/ZModal";
import { useSetRecoilState } from "recoil";
import { lastAction } from "@src/store";
import { useTranslation } from "react-i18next";

const Actions = ({ contact }: { contact: ContactItem }) => {
  const { t } = useTranslation();
  const setLastAction = useSetRecoilState(lastAction);

  return (
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
            console.log("delete contact");
            setLastAction("contactDeleted");
            window.history.back();
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </button>

        <button
          type="button"
          className="goal-action-archive shareOptions-btn"
          onClick={async () => {
            console.log("Edit name");
            setLastAction("contactEdited");
            window.history.back();
          }}
        >
          <ActionDiv label={t("Edit")} icon="Edit" />
        </button>
      </div>
    </ZModal>
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

  useEffect(() => {
    getAllContacts().then((fetchedContacts) => {
      setContacts(fetchedContacts);
    });
  }, []);

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
