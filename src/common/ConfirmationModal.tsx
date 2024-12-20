import { Checkbox } from "antd";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState, displayConfirmation } from "@src/store";
import { ConfirmationModalProps } from "@src/Interfaces/IPopupModals";
import { getConfirmButtonText } from "@src/constants/goals";
import ZModal from "./ZModal";
import DefaultButton from "./DefaultButton";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ action, handleClick, handleClose }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  const { actionCategory, actionName } = action;
  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [displayModal, setDisplayModal] = useRecoilState(displayConfirmation);
  const [headerKey, noteKey] = [`${actionCategory}.${actionName}.header`, `${actionCategory}.${actionName}.note`];
  const getChoiceButton = (choice: string) => (
    <DefaultButton
      variant={choice === "cancel" ? "secondary" : "primary"}
      onClick={async () => {
        if (choice === "cancel") {
          handleClose();
        } else {
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
        }
      }}
    >
      {t(choice)}
    </DefaultButton>
  );
  return (
    <ZModal open onCancel={handleClose}>
      <div className="d-flex f-col gap-16">
        <p className="popupModal-title" style={{ margin: 0 }}>
          {t(headerKey)}
        </p>
        <p className="m-0">
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
      </div>
    </ZModal>
  );
};

export default ConfirmationModal;
