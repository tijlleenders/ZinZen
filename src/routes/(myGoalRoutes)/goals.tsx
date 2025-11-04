import React from "react";
import AppLayout from "@src/layouts/AppLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const RouteComponent = () => {
  return (
    <AppLayout title="myGoals">
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute("/(myGoalRoutes)/goals")({
  component: RouteComponent,
});
