import BottomNavbar from "@components/BottomNavbar/BottomNavbar";
import Header from "@components/Header/Header";
import { AppLayoutProps } from "@src/Interfaces/ILayouts";
import React from "react";

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => (
  <>
    <Header title={title} />
    {children}
    <BottomNavbar />
  </>
);

export default AppLayout;
