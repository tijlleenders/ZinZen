import React from "react";
import { Modal } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";

interface ZModalProps {
  children: React.ReactNode;
  className: string;
  open: boolean;
  onCancel: () => void;
  width: number;
}

const ZModal: React.FC<ZModalProps> = ({ children, className, open, onCancel, width }) => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);

  const commonClassName = `popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
    theme[darkModeStatus ? "dark" : "light"]
  }`;
  const combinedClassName = `${className} ${commonClassName}`;

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
      maskStyle={maskStyle}
      width={width}
    >
      {children}
    </Modal>
  );
};

export default ZModal;
