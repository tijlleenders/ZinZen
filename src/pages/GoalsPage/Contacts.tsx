import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContactAccordionActions from "@components/ContactsComponents/ContactAccordionActions";
import { getAllContacts } from "@src/api/ContactsAPI";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout";
import ContactItem from "@src/models/ContactItem";

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
      {showOptions && <ContactAccordionActions contact={selectedContact} />}
      <div className="myGoals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts.map((contact) => (
              <Contacts key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
