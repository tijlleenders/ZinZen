import React from "react";

const BottomNavLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      display: "flex",
      background: "var(--bottom-nav-color)",
      width: "100%",
      maxWidth: 600,
      height: 56,
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);

export default BottomNavLayout;
