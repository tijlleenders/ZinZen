import { createFileRoute } from "@tanstack/react-router";
import { FAQPage } from "@pages/FAQPage/FAQPage";

export const Route = createFileRoute("/(basicRoutes)/zinzenfaq")({ component: FAQPage });
