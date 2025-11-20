import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { TJournalConfigMode } from "@src/types";
import { PageTitle } from "@src/constants/pageTitle";

export const Route = createFileRoute("/MyJournal")({
  validateSearch: (search: { mode?: TJournalConfigMode }) => search,
  component: () => {
    const { mode } = Route.useSearch();
    return (
      <AppLayout title={PageTitle.MyJournal}>
        <FeelingsPage showAddFeelingsModal={mode === "addJournal"} />
      </AppLayout>
    );
  },
});
