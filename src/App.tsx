/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  darkModeState,
  languageSelectionState,
  displayToast,
  lastAction,
  displayConfirmation,
  backupRestoreModal,
  openDevMode,
} from "@store";

import lightAvatar from "@assets/images/mainAvatarLight.svg";
import darkAvatar from "@assets/images/mainAvatarDark.svg";

import { FAQPage } from "@pages/FAQPage/FAQPage";
import Contacts from "@pages/ContactsPage/Contacts";
import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import MyGroupsPage from "@pages/MyGroupsPage/MyGroupsPage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";
import BackupRestoreModal from "@components/BackupRestoreModal";
import { findTypeOfSub } from "@api/PubSubAPI";
import { checkMagicGoal } from "@api/GoalsAPI";
import { syncGroupPolls } from "@api/PublicGroupsAPI";
import { addSharedWMGoal } from "@api/SharedWMAPI";
import { getContactByRelId, updateAllUnacceptedContacts } from "@api/ContactsAPI";
import { refreshTaskCollection } from "@api/TasksAPI";
import { getTheme, themeState } from "./store/ThemeState";
import { handleIncomingChanges } from "./helpers/InboxProcessor";
import { getContactSharedGoals } from "./services/contact.service";
import { GoalItem } from "./models/GoalItem";

import "./global.scss";
import "./customize.scss";
import "./override.scss";

const Context = React.createContext({ name: "Default" });

const exceptionRoutes = ["/", "/invest", "/feedback", "/donate"];

const App = () => {
  const theme = useRecoilValue(themeState);
  const language = useRecoilValue(languageSelectionState);
  const darkModeEnabled = useRecoilValue(darkModeState);
  const isLanguageChosen = language !== "No language chosen.";
  const confirmationState = useRecoilValue(displayConfirmation);
  const displayBackupRestoreModal = useRecoilValue(backupRestoreModal);
  const [api, contextHolder] = notification.useNotification();
  const [devMode, setDevMode] = useRecoilState(openDevMode);
  const [showToast, setShowToast] = useRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  const openNotification = () => {
    api.info({
      icon: <img src={darkModeEnabled ? darkAvatar : lightAvatar} alt="zinzen message" />,
      closeIcon: null,
      message: `${showToast.message}`,
      description: <Context.Consumer>{() => `${showToast.extra}`}</Context.Consumer>,
      placement: "top",
    });
  };

  useEffect(() => {
    const init = async () => {
      updateAllUnacceptedContacts();
      const res = await getContactSharedGoals();
      // @ts-ignore
      const resObject = res.response.reduce(
        (acc, curr) => ({ ...acc, [curr.relId]: [...(acc[curr.relId] || []), curr] }),
        {},
      );
      if (res.success) {
        Object.keys(resObject).forEach(async (relId: string) => {
          const contactItem = await getContactByRelId(relId);
          if (contactItem) {
            // @ts-ignore
            resObject[relId].forEach(async (ele) => {
              if (ele.type === "shareMessage") {
                const { goalWithChildrens }: { goalWithChildrens: GoalItem[] } = ele;
                const rootGoal = goalWithChildrens[0];
                rootGoal.shared.contacts.push({ name: contactItem.name, relId });
                addSharedWMGoal(rootGoal)
                  .then(() => {
                    goalWithChildrens.slice(1).forEach((goal) => {
                      addSharedWMGoal(goal).catch((err) => console.log(`Failed to add in inbox ${goal.title}`, err));
                    });
                  })
                  .catch((err) => console.log(`Failed to add root goal ${rootGoal.title}`, err));
              } else if (["shared", "collaboration", "collaborationInvite"].includes(ele.type)) {
                let typeOfSub = ele.rootGoalId ? await findTypeOfSub(ele.rootGoalId) : "none";
                if (ele.type === "collaborationInvite") {
                  typeOfSub = "collaborationInvite";
                } else if (ele.type === "collaboration") {
                  typeOfSub = "collaboration";
                } else if (ele.type === "shared") {
                  typeOfSub = typeOfSub === "collaboration" ? "collaboration" : "shared";
                }
                if (typeOfSub !== "none") {
                  handleIncomingChanges({ ...ele, type: typeOfSub }).then(() => setLastAction("goalNewUpdates"));
                }
              }
            });
          }
        });
      }
      syncGroupPolls().then(() => setLastAction("groupSync"));
    };
    const installId = localStorage.getItem("installId");
    if (!installId) {
      localStorage.setItem("installId", uuidv4());
      localStorage.setItem("darkMode", "off");
      localStorage.setItem("theme", JSON.stringify(getTheme()));
    } else {
      init();
    }
    const currentPath = window.location.pathname.toLowerCase();
    if (!isLanguageChosen && !exceptionRoutes.includes(currentPath)) {
      window.open("/", "_self");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("confirmationState", JSON.stringify(confirmationState));
  }, [confirmationState]);

  useEffect(() => {
    const checkDevMode = async () => {
      const isDevMode = await checkMagicGoal();
      if (!devMode && isDevMode) {
        setDevMode(isDevMode);
      }
    };
    const checkUpdates = async () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          if (registration.waiting) {
            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
          }
        })
        .catch((err) => console.log(err));
    };
    checkUpdates();
    checkDevMode();
  }, []);

  useEffect(() => {
    const lastRefresh = localStorage.getItem("lastRefresh");
    const today = new Date().toLocaleDateString();
    if (lastRefresh !== today) {
      refreshTaskCollection().then(() => {
        localStorage.setItem("lastRefresh", today);
        setLastAction("TaskCollectionRefreshed");
      });
    }
  }, []);

  useEffect(() => {
    if (showToast.open) {
      openNotification();
      setShowToast({ ...showToast, open: false });
    }
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
            <Route path="/Contacts" element={<Contacts />} />
            <Route path="/MyGoals" element={<MyGoalsPage />} />
            <Route path="/MyGroups" element={<MyGroupsPage />} />
            <Route path="/MyJournal" element={<ShowFeelingsPage />} />
            <Route path="*" element={<MyGoalsPage />} />
            <Route path="/ZinZenFAQ" element={<FAQPage />} />
            <Route path="/invite/:id" element={<InvitePage />} />
            <Route path="/Invest" element={<InvestPage />} />
            <Route
              path="/donate"
              Component={() => {
                window.location.href = "https://donate.stripe.com/6oE4jK1iPcPT1m89AA"
                return null;
              }}
            />
          </Routes>
        </BrowserRouter>
        {displayBackupRestoreModal && <BackupRestoreModal />}
      </div>
    </div>
  );
};

export default App;
