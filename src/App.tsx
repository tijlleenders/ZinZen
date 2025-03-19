import React, { useEffect } from "react";
import { notification } from "antd";
import { BrowserRouter } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState, displayToast, backupRestoreModal, languageChangeModal } from "@store";

import lightAvatar from "@assets/images/mainAvatarLight.svg";
import darkAvatar from "@assets/images/mainAvatarDark.svg";

import BackupRestoreModal from "@components/BackupRestoreModal";

import { LanguageChangeModal } from "@components/LanguageChangeModal/LanguageChangeModal";

import useApp from "./hooks/useApp";
import { themeState } from "./store/ThemeState";

import "./global.scss";
import "./customize.scss";
import "./override.scss";
import "./short.scss";
import { AppRoutes } from "./Routes";

const Context = React.createContext({ name: "Default" });

const App = () => {
  const { isLanguageChosen } = useApp();
  const theme = useRecoilValue(themeState);
  const darkModeEnabled = useRecoilValue(darkModeState);
  const [api, contextHolder] = notification.useNotification();
  const [showToast, setShowToast] = useRecoilState(displayToast);

  const displayBackupRestoreModal = useRecoilValue(backupRestoreModal);
  const displayLanguageChangeModal = useRecoilValue(languageChangeModal);
  const openNotification = () => {
    api.info({
      style: {
        backgroundColor: "var(--secondary-background)",
      },
      icon: <img src={darkModeEnabled ? darkAvatar : lightAvatar} alt="zinzen message" />,
      closeIcon: null,
      message: `${showToast.message}`,
      description: <Context.Consumer>{() => `${showToast.extra}`}</Context.Consumer>,
      placement: "top",
      className: `toast-${darkModeEnabled ? "dark" : "light"} ${darkModeEnabled ? "dark" : "light"}-theme${
        theme[darkModeEnabled ? "dark" : "light"]
      }`,
    });
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const notifications = document.getElementsByClassName("ant-notification-notice");
    let clickedInside = false;

    Array.from(notifications).forEach((notificationElement) => {
      if (notificationElement.contains(e.target as Node)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      api.destroy();
    }
  };

  useEffect(() => {
    if (showToast.open) {
      openNotification();
      setShowToast({ ...showToast, open: false });
    }
  }, [showToast]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  return (
    <div className={`${darkModeEnabled ? "dark" : "light"}-theme${theme[darkModeEnabled ? "dark" : "light"]}`}>
      <div className={`App-${darkModeEnabled ? "dark" : "light"}`}>
        <BrowserRouter>
          {isLanguageChosen}
          {contextHolder}
          <AppRoutes />
        </BrowserRouter>
        {displayBackupRestoreModal && <BackupRestoreModal />}
        {displayLanguageChangeModal && <LanguageChangeModal />}
      </div>
    </div>
  );
};

export default App;
