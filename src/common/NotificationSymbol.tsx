import React from "react";

const NotificationSymbol = ({ color }:{color: string}) => (
  <div style={{
    width: "7px",
    height: "7px",
    background: color,
    borderRadius: "50%",
    position: "absolute",
    left: "33px",
    top: "33px"
  }}
  />
);

export default NotificationSymbol;
