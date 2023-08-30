import React from "react";

const NotificationSymbol = ({ color }: { color: string }) => (
  <div
    style={{
      width: 7,
      height: 7,
      background: color,
      borderRadius: "50%",
      position: "absolute",
      left: "40%",
      top: "40%",
    }}
  />
);

export default NotificationSymbol;
