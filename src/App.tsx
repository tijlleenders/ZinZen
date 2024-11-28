import React, { useEffect } from "react";
import { notification } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState, displayToast, backupRestoreModal, languageChangeModal } from "@store";

import lightAvatar from "@assets/images/mainAvatarLight.svg";
import darkAvatar from "@assets/images/mainAvatarDark.svg";

import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import BackupRestoreModal from "@components/BackupRestoreModal";

import { FAQPage } from "@pages/FAQPage/FAQPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { LanguageChangeModal } from "@components/LanguageChangeModal/LanguageChangeModal";

import { MyGoals } from "@pages/GoalsPage/MyGoals";
import ContactsPage from "@pages/GoalsPage/ContactsPage";
import { PartnerProvider } from "./contexts/partner-context";
import { ActiveGoalProvider } from "./contexts/activeGoal-context";

import useApp from "./hooks/useApp";
import AppLayout from "./layouts/AppLayout";
import { themeState } from "./store/ThemeState";

import "./global.scss";
import "./customize.scss";
import "./override.scss";
import "./short.scss";

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
      setTimeout(() => {
        api.destroy();
      }, 0);
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
          <Routes>
            {!isLanguageChosen ? (
              <Route path="/" element={<LandingPage />} />
            ) : (
              <Route
                path="/"
                element={
                  <ActiveGoalProvider>
                    <MyTimePage />
                  </ActiveGoalProvider>
                }
              />
            )}
            <Route path="/Feedback" element={<FeedbackPage />} />
            <Route
              path="*"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
            <Route
              path="/goals/:parentId"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
            <Route
              path="/goals/:parentId/:activeGoalId"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
            <Route path="/partners" element={<ContactsPage />} />
            <Route path="/partners/:partnerId" element={<ContactsPage />} />

            <Route
              path="partners/:partnerId/goals"
              element={
                <PartnerProvider>
                  <PartnerGoals />
                </PartnerProvider>
              }
            />
            <Route
              path="partners/:partnerId/goals/:parentId"
              element={
                <PartnerProvider>
                  <PartnerGoals />
                </PartnerProvider>
              }
            />
            <Route
              path="partners/:partnerId/goals/:parentId/:activeGoalId"
              element={
                <PartnerProvider>
                  <PartnerGoals />
                </PartnerProvider>
              }
            />
            {/* <Route path="/goals" element={<GoalsPage />} /> */}

            <Route
              path="/MyJournal"
              element={
                <AppLayout title="myJournal">
                  <FeelingsPage />
                </AppLayout>
              }
            />
            <Route path="/ZinZenFAQ" element={<FAQPage />} />
            <Route path="/invite/:id" element={<InvitePage />} />
            <Route path="/Invest" element={<InvestPage />} />
            <Route
              path="/donate"
              Component={() => {
                window.location.href = "https://donate.stripe.com/6oE4jK1iPcPT1m89AA";
                return null;
              }}
            />
          </Routes>
        </BrowserRouter>
        {displayBackupRestoreModal && <BackupRestoreModal />}
        {displayLanguageChangeModal && <LanguageChangeModal />}
      </div>
    </div>
  );
};

export default App;
