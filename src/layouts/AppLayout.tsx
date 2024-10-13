import React from "react";

import { AppLayoutProps } from "@src/Interfaces/ILayouts";
import BottomNavbar from "@components/BottomNavbar/BottomNavbar";

import Header from "../components/Header/Header";

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, debounceSearch }) => (
  <>
    <Header title={title} debounceSearch={debounceSearch} />
    <div className="mainDiv">{children}</div>
    <BottomNavbar title={title} />
  </>
);

export default AppLayout;
