import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout/AppLayout";

const RouteComponent = () => {
  return (
    <AppLayout title="myGoals" enableSearch>
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute("/(myGoalRoutes)/goals")({
  component: RouteComponent,
});
