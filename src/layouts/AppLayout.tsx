import React from "react";

import { AppLayoutProps } from "@src/Interfaces/ILayouts";
import BottomNavbar from "@components/BottomNavbar/BottomNavbar";

import Header from "../common/Header/Header";

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, debounceSearch }) => (
  <>
    <Header title={title} debounceSearch={debounceSearch} />
    <div style={{
      maxWidth: 600,
      minWidth: 236,
      overflow: "scroll",
      width: "100%",
      marginTop: 57,
      height: "calc(100vh - 112px)",
      position: "sticky",
    }}
    > {children}
    </div>
    <BottomNavbar title={title} />
  </>
);

export default AppLayout;
