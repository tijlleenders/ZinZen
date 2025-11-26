import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@src/layouts/AppLayout/AppLayout";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { TJournalConfigMode } from "@src/types";
import { PageTitle } from "@src/constants/pageTitle";
import { useHeaderLogoHandlers } from "@src/hooks/useHeaderLogoHandlers";
import JournalFab from "@components/fab/JournalFab";

export const Route = createFileRoute("/MyJournal")({
  validateSearch: (search: { mode?: TJournalConfigMode }) => search,
  component: () => {
    const { mode } = Route.useSearch();
    const { handleEnterPartnerMode } = useHeaderLogoHandlers();

    return (
      <AppLayout title={PageTitle.MyJournal} onLogoClick={handleEnterPartnerMode}>
        <FeelingsPage showAddFeelingsModal={mode === "addJournal"} />
        <JournalFab />
      </AppLayout>
    );
  },
});
