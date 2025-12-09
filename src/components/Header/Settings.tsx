import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Dropdown, MenuProps, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import verticalDots from "@assets/images/verticalDots.svg";
import { darkModeState } from "@src/store";
import { themeSelectionMode, themeState } from "@src/store/ThemeState";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const setThemeSelection = useSetRecoilState(themeSelectionMode);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const dropdownOptions = [t("donate"), t("feedback"), t("blog"), t("backup"), t("changeLanguage"), t("changeTheme")];

  const toggleDarkModeStatus = () => {
    localStorage.setItem(LocalStorageKeys.DARK_MODE, darkModeStatus ? "off" : "on");
    setDarkModeStatus(!darkModeStatus);
  };

  const theme = useRecoilValue(themeState);

  const handleChangeTheme = async () => {
    await navigate({ to: "/goals/$parentId", params: { parentId: "root" }, state: (state) => ({ ...state }) });
    setThemeSelection(true);
  };

  const items: MenuProps["items"] = [
    ...[...dropdownOptions, ...(showInstall ? ["Install"] : [])].map((ele, index) => ({
      label: ele,
      key: `${index}`,
      onClick: async () => {
        if (ele === t("changeTheme")) {
          await handleChangeTheme();
        } else if (ele === t("donate")) {
          window.open("https://donate.stripe.com/6oE4jK1iPcPT1m89AA", "_self");
        } else if (ele === t("feedback")) {
          navigate({ to: "/feedback" });
        } else if (ele === t("blog")) {
          window.open("https://blog.zinzen.me", "_self");
        } else if (ele === t("backup")) {
          navigate({
            to: ".",
            search: { show: "backupModal" },
            state: (state) => ({ ...state }),
          });
        } else if (ele === t("changeLanguage")) {
          navigate({
            to: ".",
            search: { show: "langChangeModal" },
            state: (state) => ({ ...state }),
          });
        } else if (ele === t("Install")) {
          if (deferredPrompt) {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome === "accepted") {
              setShowInstall(false);
              setDeferredPrompt(null);
            }
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
            marginTop: 12,
            alignItems: "center",
            fontSize: "18px",
          }}
          onClickCapture={toggleDarkModeStatus}
        >
          <p>{t("darkMode")}</p>
          <Switch checked={darkModeStatus} />
        </div>
      ),
      key: "7",
    },
  ];

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
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
