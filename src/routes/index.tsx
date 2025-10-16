import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import useApp from "@src/hooks/useApp";

const IndexComponent = () => {
  const { isLanguageChosen } = useApp();

  if (!isLanguageChosen) {
    return <LandingPage />;
  }

  return <MyTimePage />;
};

export const Route = createFileRoute("/")({ component: IndexComponent });
