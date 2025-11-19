import React from "react";
import { Outlet } from "@tanstack/react-router";
import { useGetAllContacts } from "@src/hooks/api/Contacts/queries/useGetAllContacts";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";
import "@pages/GoalsPage/GoalsPage.scss";

const ContactsPage = () => {
  const { data: contacts } = useGetAllContacts();
  return (
    <AppLayout title={PageTitle.Contacts}>
      <div className="goals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts?.map((contact) => (
              <Contacts key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </AppLayout>
  );
};

export default ContactsPage;
