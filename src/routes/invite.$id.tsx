import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import InvitePage from "@pages/InvitePage/InvitePage";

export const Route = createFileRoute("/invite/$id")({ component: () => <InvitePage /> });
