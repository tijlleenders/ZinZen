import React from "react";
import { useLocation } from "react-router-dom";
import SubHeader from "@src/common/SubHeader";
import AppLayout from "@src/layouts/AppLayout";

export const FocusPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const taskTitle = searchParams.get("taskTitle");

  return (
    <AppLayout title="Focus">
      <SubHeader title="Task Name" leftNav={() => {}} rightNav={() => {}} showLeftNav={false} showRightNav={false} />
    </AppLayout>
  );
};
