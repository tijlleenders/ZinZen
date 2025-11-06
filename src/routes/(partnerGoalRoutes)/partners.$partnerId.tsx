import React from "react";
import ContactActionModal from "@pages/GoalsPage/components/modals/ContactActionModal";
import EditContactModal from "@pages/GoalsPage/components/modals/EditContactModal";
import { createFileRoute, useParams, useSearch, Outlet } from "@tanstack/react-router";
import { useGetContactByPartnerId } from "@src/hooks/api/Contacts/queries/useGetContactByPartnerId";

const RouteComponent = () => {
  const { partnerId } = useParams({ strict: false });
  const { data: partner } = useGetContactByPartnerId(partnerId || "");
  const { showOptions, mode, type } = useSearch({ strict: false }) as {
    showOptions?: string;
    mode?: string;
    type?: string;
  };

  if (!partner) {
    return null;
  }

  return (
    <>
      {showOptions === "contactOptions" && <ContactActionModal contact={partner} />}
      {type === "contact" && mode === "edit" && <EditContactModal contact={partner} />}
      <Outlet />
    </>
  );
};

export const Route = createFileRoute("/(partnerGoalRoutes)/partners/$partnerId")({
  component: RouteComponent,
});
