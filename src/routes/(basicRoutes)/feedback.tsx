import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";

const FeedbackComponent = () => <FeedbackPage />;

export const Route = createFileRoute("/(basicRoutes)/feedback")({ component: FeedbackComponent });
