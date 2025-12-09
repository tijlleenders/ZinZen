import React, { ReactNode } from "react";
import BottomBarContainer from "@components/BottomNavbar/BottomBarContainer";
import Header from "@components/Header/Header";
import Search from "@src/common/Search";
import { useSearchState } from "@src/hooks/useSearchState";
import { PageTitle } from "@src/constants/pageTitle";
import "./AppLayout.scss";

export interface AppLayoutProps {
  title: PageTitle;
  children: ReactNode;
  enableSearch?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, enableSearch = false }) => {
  const { showSearch } = useSearchState();

  return (
    <div className="appLayout">
      {enableSearch && showSearch ? <Search /> : <Header title={title} />}
      <div className="appLayout-children">{children}</div>
      <BottomBarContainer />
    </div>
  );
};

export default React.memo(AppLayout);
