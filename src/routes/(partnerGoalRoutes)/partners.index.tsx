import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";
import Contacts from "@src/helpers/Contacts";
import { useGetAllContacts } from "@src/hooks/api/Contacts/queries/useGetAllContacts";
import "@pages/GoalsPage/GoalsPage.scss";

const PartnersIndexComponent = () => {
  const { data: contacts } = useGetAllContacts();

  return (
    <AppLayout title={PageTitle.Contacts} showAddBtn={false}>
      <div className="goals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts?.map((contact) => (
              <Contacts key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/")({
  component: PartnersIndexComponent,
});
