import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";

export const Route = createFileRoute("/MyJournal")({
  component: () => (
    <AppLayout title="myJournal">
      <FeelingsPage />
    </AppLayout>
  ),
});
