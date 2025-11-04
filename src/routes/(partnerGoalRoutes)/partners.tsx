import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(partnerGoalRoutes)/partners")({
  component: () => <Outlet />,
});
