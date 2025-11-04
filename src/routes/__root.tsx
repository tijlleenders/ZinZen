import React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "react-query";

interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = () => (
  <>
    <Outlet />
    {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
