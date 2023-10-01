import React from "react";

const NotificationSymbol = ({ color }: { color: string }) => (
  <div
    style={{
      width: 6,
      height: 6,
      background: color,
      borderRadius: "50%",
    }}
  />
);

export default NotificationSymbol;
