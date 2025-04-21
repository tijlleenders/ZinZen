import React from "react";

const NotificationSymbol = ({ color, dataTestId }: { color: string; dataTestId?: string }) => (
  <div
    data-testid={dataTestId}
    style={{
      width: 6,
      height: 6,
      background: color,
      borderRadius: "50%",
    }}
  />
);

export default NotificationSymbol;
