import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import ContactsPage from "@pages/GoalsPage/ContactsPage";

const PartnersComponent = () => <ContactsPage />;

export const Route = createFileRoute("/partners/")({ component: PartnersComponent });
