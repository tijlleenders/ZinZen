import React from "react";
import { Modal } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import { ZModalProps } from "@src/Interfaces/ICommon";

const ZModal: React.FC<ZModalProps> = ({ children, type, open, onCancel, width, style }) => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);

  const commonClassName = `popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
    theme[darkModeStatus ? "dark" : "light"]
  }`;
  const combinedClassName = `${type} ${commonClassName}`;

  const maskStyle = {
    backgroundColor: darkModeStatus ? "rgba(0, 0, 0, 0.50)" : "rgba(87, 87, 87, 0.4)",
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      onCancel={onCancel || (() => window.history.back())}
      className={combinedClassName}
      styles={{ mask: maskStyle }}
      width={width}
      style={style}
      data-testid="zmodal"
    >
      {children}
    </Modal>
  );
};

export default ZModal;
