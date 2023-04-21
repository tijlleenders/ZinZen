import BottomNavbar from "@components/BottomNavbar/BottomNavbar";
import Header from "@components/Header/Header";
import { AppLayoutProps } from "@src/Interfaces/ILayouts";
import React from "react";

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => (
  <>
    <Header title={title} />
    <div style={{
      maxWidth: 600,
      minWidth: 236,
      overflow: "scroll",
      width: "100%",
      marginTop: 75,
      height: "calc(100vh - 145px)"
    }}
    > {children}
    </div>
    <BottomNavbar />
  </>
);

export default AppLayout;
