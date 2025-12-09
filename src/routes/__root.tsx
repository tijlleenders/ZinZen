import React from "react";
import { createRootRouteWithContext, Outlet, useSearch } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "react-query";
import BackupRestoreModal from "@components/BackupRestoreModal";
import { LanguageChangeModal } from "@components/LanguageChangeModal/LanguageChangeModal";

interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = () => {
  const { show } = useSearch({ strict: false });
  return (
    <>
      <Outlet />
      <BackupRestoreModal open={show === "backupModal"} />
      <LanguageChangeModal open={show === "langChangeModal"} />

      {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: (search: { show?: "backupModal" | "langChangeModal" }) => search,
  component: RootComponent,
});
