import InvestPage from "@pages/InvestPage/InvestPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(basicRoutes)/invest")({
  component: InvestPage,
});
