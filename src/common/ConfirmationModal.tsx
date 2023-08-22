import { Checkbox, Modal } from "antd";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { themeState } from "@src/store/ThemeState";
import { darkModeState, displayConfirmation } from "@src/store";
import { getConfirmButtonText } from "@src/constants/myGoals";
import { ConfirmationModalProps } from "@src/Interfaces/IPopupModals";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ action, handleClick }) => {
  const { t } = useTranslation();
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);

  const { actionCategory, actionName } = action;
  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [displayModal, setDisplayModal] = useRecoilState(displayConfirmation);
  // @ts-ignore
  const [headerKey, noteKey] = [`${actionCategory}.${actionName}.header`, `${actionCategory}.${actionName}.note`];
  const getChoiceButton = (choice: string) => (
    <button
      type="button"
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      style={{
        boxShadow: darkModeStatus ? "rgba(255, 255, 255, 0.25) 0px 1px 2px" : "0px 1px 2px rgba(0, 0, 0, 0.25)",
        background: choice !== "cancel" ? "var(--primary-background)" : "transparent",
      }}
      onClick={async () => {
        if (neverShowAgain) {
          const actionChange = { ...displayModal[actionCategory] };
          // @ts-ignore
          actionChange[actionName] = false;
          const newDisplayModal = { ...displayModal };
          // @ts-ignore
          newDisplayModal[actionCategory] = actionChange;
          console.log(newDisplayModal);
          setDisplayModal({ ...newDisplayModal, open: false });
        }
        await handleClick(choice === "cancel" ? choice : actionName);
      }}
    >
      {t(choice)}
    </button>
  );
  return (
    <Modal
      open={displayModal.open}
      closable={false}
      footer={null}
      centered
      onCancel={() => {
        window.history.back();
      }}
      className={`popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]
        }`}
    >
      <p className="popupModal-title" style={{ margin: 0 }}>
        {t(headerKey)}
      </p>
      <p>
        {t("note")}: {t(noteKey)}
      </p>
      <div style={{ display: "flex", gap: "5px" }}>
        <Checkbox
          checked={neverShowAgain}
          className="checkbox"
          onChange={() => {
            setNeverShowAgain(!neverShowAgain);
          }}
        >
          {t("dontAskAgain")}
        </Checkbox>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {getChoiceButton("cancel")}
        {getChoiceButton(getConfirmButtonText(actionName))}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
