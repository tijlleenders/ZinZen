import React, { ReactNode } from "react";
import BottomNavbar from "@components/BottomNavbar/BottomNavbar";
import Header from "@components/Header/Header";
import Search from "@src/common/Search";
import { useSearchState } from "@src/hooks/useSearchState";
import "./AppLayout.scss";
import GlobalAddBtn from "@components/GlobalAddBtn/GlobalAddBtn";

// TODO: create test for display of GlobalAddBtn

export interface AppLayoutProps {
  title: string;
  children: ReactNode;
  showAddBtn?: boolean;
  enableSearch?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, showAddBtn = true, enableSearch = false }) => {
  const { showSearch } = useSearchState();

  return (
    <div className="appLayout">
      {enableSearch && showSearch ? <Search /> : <Header title={title} />}
      <div className="appLayout-children">{children}</div>
      {showAddBtn && <GlobalAddBtn add={title} />}
      <BottomNavbar />
    </div>
  );
};

export default React.memo(AppLayout);
