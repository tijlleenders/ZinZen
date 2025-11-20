import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";

const RouteComponent = () => {
  return (
    <AppLayout title={PageTitle.MyGoals} enableSearch>
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute("/(myGoalRoutes)/goals")({
  component: RouteComponent,
});
