import React, { ReactNode } from "react";
import BottomNavbar from "@components/BottomNavbar/BottomNavbar";
import Header from "@components/Header/Header";
import "./AppLayout.scss";
import GlobalAddBtn from "@components/GlobalAddBtn/GlobalAddBtn";

// TODO: create test for display of GlobalAddBtn

export interface AppLayoutProps {
  title: string;
  children: ReactNode;
  showAddBtn?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, showAddBtn = true }) => {
  return (
    <div className="appLayout">
      <Header title={title} />
      <div className="appLayout-children">{children}</div>
      {showAddBtn && <GlobalAddBtn add={title} />}
      <BottomNavbar title={title} />
    </div>
  );
};

export default React.memo(AppLayout);
