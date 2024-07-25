import React, { useEffect } from "react";
import { notification } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState, displayToast, backupRestoreModal, languageChangeModal } from "@store";

import lightAvatar from "@assets/images/mainAvatarLight.svg";
import darkAvatar from "@assets/images/mainAvatarDark.svg";

import GoalsPage from "@pages/GoalsPage/GoalsPage";
import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import BackupRestoreModal from "@components/BackupRestoreModal";

import { FAQPage } from "@pages/FAQPage/FAQPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { LanguageChangeModal } from "@components/LanguageChangeModal/LanguageChangeModal";
import { MyGoals } from "@pages/GoalsPage/MyGoals";
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
  const handleClick = () => {
    api.destroy();
  };
  useEffect(() => {
    if (showToast.open) {
      openNotification();
      setShowToast({ ...showToast, open: false });
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showToast]);
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
              <Route path="/" element={<MyTimePage />} />
            )}
            <Route path="/Feedback" element={<FeedbackPage />} />
            <Route
              path="/MyGoals"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
            <Route
              path="/MyGoals/:parentId"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
            <Route
              path="/MyGoals/:parentId/:activeGoalId"
              element={
                <ActiveGoalProvider>
                  <MyGoals />
                </ActiveGoalProvider>
              }
            />
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

            <Route
              path="/MyJournal"
              element={
                <AppLayout title="myJournal">
                  <FeelingsPage />
                </AppLayout>
              }
            />
            <Route path="*" element={<GoalsPage />} />
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
