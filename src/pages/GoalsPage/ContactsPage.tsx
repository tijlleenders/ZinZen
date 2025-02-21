import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllContacts } from "@src/api/ContactsAPI";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout";
import ContactItem from "@src/models/ContactItem";
import { useQuery } from "react-query";
import { PageTitle } from "@src/constants/pageTitle";
import ContactActionModal from "./components/modals/ContactActionModal";

const ContactsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const navigate = useNavigate();
  const showOptions = searchParams.get("showOptions") === "true" && selectedContact;
  const { data: contacts } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllContacts(),
  });

  useEffect(() => {
    setSelectedContact(null);
    if (!contacts || contacts.length === 0) {
      navigate("/goals");
    }
  }, [contacts]);

  return (
    <AppLayout title={PageTitle.Contacts}>
      {showOptions && <ContactActionModal contact={selectedContact} />}
      <div className="myGoals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts?.map((contact) => (
              <Contacts key={contact.id} contact={contact} setSelectedContact={setSelectedContact} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
