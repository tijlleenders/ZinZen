import AppLayout from "@src/layouts/AppLayout";
import React from "react";
import { MyGoals } from "./MyGoals";

const MyGoalsPage = () => {
  return (
    <AppLayout title="myGoals">
      <MyGoals />
    </AppLayout>
  );
};

export default MyGoalsPage;
