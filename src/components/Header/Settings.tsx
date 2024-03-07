import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dropdown, MenuProps, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import verticalDots from "@assets/images/verticalDots.svg";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import useGlobalStore from "@src/hooks/useGlobalStore";
import { is24HourFormat } from "@src/store/HourFormatState";

const Settings = () => {
  const { t } = useTranslation();
  const [hourFormat, setHourFormat] = useRecoilState(is24HourFormat);

  const navigate = useNavigate();
  const { handleChangeTheme, handleBackResModal, handleBackLangModal } = useGlobalStore();

  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const dropdownOptions = [t("donate"), t("feedback"), t("blog"), t("backup"), t("changeLanguage"), t("changeTheme")];

  const toggleDarkModeStatus = () => {
    localStorage.setItem("darkMode", darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  const toggleHourFormat = () => {
    localStorage.setItem("hourFormat", hourFormat ? "12" : "24");
    setHourFormat(!hourFormat);
  };

  const theme = useRecoilValue(themeState);

  const items: MenuProps["items"] = [
    ...[...dropdownOptions, ...(showInstall ? ["Install"] : [])].map((ele, index) => ({
      label: ele,
      key: `${index}`,
      onClick: () => {
        if (ele === t("changeTheme")) {
          handleChangeTheme();
        } else if (ele === t("donate")) {
          window.open("https://donate.stripe.com/6oE4jK1iPcPT1m89AA", "_self");
        } else if (ele === t("feedback")) {
          navigate("/Feedback");
        } else if (ele === t("blog")) {
          window.open("https://blog.zinzen.me", "_self");
        } else if (ele === t("backup")) {
          handleBackResModal();
        } else if (ele === t("changeLanguage")) {
          handleBackLangModal();
        } else if (ele === t("Install")) {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
              if (choiceResult.outcome === "accepted") {
                setShowInstall(false);
                setDeferredPrompt(null);
              }
            });
          }
        }
      },
    })),
    {
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
          }}
        >
          <p>{t("hourFormat")}</p>
          <Switch checked={hourFormat} onClick={toggleHourFormat} />
        </div>
      ),
      key: "7",
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
          }}
          onClickCapture={toggleDarkModeStatus}
        >
          <p>{t("darkMode")}</p>
          <Switch checked={darkModeStatus} />
        </div>
      ),
      key: "8",
    },
  ];

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
  return (
    <Dropdown
      rootClassName={`header-dropdown${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
        theme[darkModeStatus ? "dark" : "light"]
      }`}
      overlayStyle={{ width: 175 }}
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <img
        className="theme-icon header-icon settings-icon"
        src={verticalDots}
        alt="Settings"
        style={{ padding: "10px" }}
      />
    </Dropdown>
  );
};

export default Settings;
