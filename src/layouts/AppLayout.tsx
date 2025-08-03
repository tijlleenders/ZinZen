import React, { ReactNode } from "react";
import BottomNavbar from "@components/BottomNavbar/BottomNavbar";
import Header from "../components/Header/Header";

export interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => (
  <>
    <Header title={title} />
    <div
      style={{
        maxWidth: 600,
        minWidth: 236,
        overflow: "scroll",
        scrollBehavior: "smooth",
        width: "100%",
        marginTop: 60,
        marginBottom: 7,
        height: "calc(100vh - 112px)",
        paddingBottom: 100,
        zIndex: 0,
      }}
      className="appLayout"
    >
      {children}
    </div>
    <BottomNavbar title={title} />
  </>
);

export default React.memo(AppLayout);
