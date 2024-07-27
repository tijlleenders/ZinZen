/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IBackdrop } from "@src/Interfaces/ICommon";
import React from "react";

const Backdrop: React.FC<IBackdrop> = ({ customStyle, opacity, onClick }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `rgba(0, 0, 0, ${opacity})`,
      ...(customStyle || {}),
    }}
    onClick={onClick}
    onContextMenu={(e) => e.preventDefault()}
  />
);

export default Backdrop;
