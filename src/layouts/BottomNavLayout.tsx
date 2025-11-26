import React from "react";
import "./BottomNavLayout.scss";

const BottomNavLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bottom-nav-layout">{children}</div>
);

export default BottomNavLayout;
