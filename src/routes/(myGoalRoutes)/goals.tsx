import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(myGoalRoutes)/goals")({
  component: () => {
    return <Outlet />;
  },
});
