/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, languageSelectionState, displayToast, lastAction, showConfirmation, backupRestoreModal, inboxAvailable } from "@store";

import { FAQPage } from "@pages/FAQPage/FAQPage";
import Contacts from "@pages/ContactsPage/Contacts";
import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import MyGroupsPage from "@pages/MyGroupsPage/MyGroupsPage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";

import BackupRestoreModal from "@components/BackupRestoreModal/BackupRestoreModal";

import { GoalItem } from "./models/GoalItem";
import { findTypeOfSub } from "./api/PubSubAPI";
import { addSharedWMGoal } from "./api/SharedWMAPI";
import { syncGroupPolls } from "./api/PublicGroupsAPI";
import { getTheme, themeState } from "./store/ThemeState";
import { handleIncomingChanges } from "./helpers/InboxProcessor";
import { getContactSharedGoals } from "./services/contact.service";
import { getContactByRelId, updateAllUnacceptedContacts } from "./api/ContactsAPI";

import "./global.scss";
import "./customize.scss";
import "@fontsource/montserrat";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  const language = useRecoilValue(languageSelectionState);
  const setInboxAvailable = useSetRecoilState(inboxAvailable);
  const darkModeEnabled = useRecoilValue(darkModeState);
  const displayBackupRestoreModal = useRecoilValue(backupRestoreModal);
  const isLanguageChosen = language !== "No language chosen.";
  const confirmationState = useRecoilValue(showConfirmation);
  const [showToast, setShowToast] = useRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  useEffect(() => {
    const init = async () => {
      updateAllUnacceptedContacts();
      const res = await getContactSharedGoals();
      // @ts-ignore
      const resObject = res.response.reduce((acc, curr) => ({ ...acc, [curr.relId]: [...(acc[curr.relId] || []), curr] }), {});
      if (res.success) {
        Object.keys(resObject).forEach(async (relId: string) => {
          const contactItem = await getContactByRelId(relId);
          if (contactItem) {
          // @ts-ignore
            resObject[relId].forEach(async (ele) => {
              if (ele.type === "shareMessage") {
                const { goalWithChildrens } : { goalWithChildrens: GoalItem[] } = ele;
                const rootGoal = goalWithChildrens[0];
                rootGoal.shared.contacts.push({ name: contactItem.name, relId });
                addSharedWMGoal(rootGoal).then(() => {
                  goalWithChildrens.slice(1).forEach((goal) => {
                    addSharedWMGoal(goal).catch((err) => console.log(`Failed to add in inbox ${goal.title}`, err));
                  });
                  setInboxAvailable(true);
                }).catch((err) => console.log(`Failed to add root goal ${rootGoal.title}`, err));
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
    if ((!isLanguageChosen) && window.location.pathname !== "/" && window.location.pathname.toLowerCase() !== "/invest") { window.open("/", "_self"); }
  }, []);

  useEffect(() => {
    localStorage.setItem("confirmationState", JSON.stringify(confirmationState));
  }, [confirmationState]);
  return (
    <div className={`${darkModeEnabled ? "dark" : "light"}-theme${theme[darkModeEnabled ? "dark" : "light"]}`}>
      <div className={`App-${darkModeEnabled ? "dark" : "light"}`}>
        <BrowserRouter>
          {isLanguageChosen}
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
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/ZinZenFAQ" element={<FAQPage />} />
            <Route path="/invite/:id" element={<InvitePage />} />
            <Route path="/Invest" element={<InvestPage />} />
          </Routes>
        </BrowserRouter>
        <button
          style={{ position: "absolute", right: 10, bottom: 200, background: "transparent", display: "none" }}
          type="button"
          onClick={() => {
            if (theme) {
              let choice = theme[darkModeEnabled ? "dark" : "light"] + 1;
              if (choice === 10) { choice = 1; }
              const newTheme = { ...theme, [darkModeEnabled ? "dark" : "light"]: choice };
              localStorage.setItem("theme", JSON.stringify(newTheme));
              setTheme({ ...newTheme });
            }
          }}
        >
          Change
        </button>
        <Toast autohide delay={5000} show={showToast.open} onClose={() => setShowToast({ ...showToast, open: false })} id="zinzen-toast">
          <Toast.Body>
            <p id="toast-message" style={showToast.extra === "" ? { margin: 0 } : {}}>{showToast.message}</p>
            { showToast.extra !== "" && <p id="extra-message">{showToast.extra}</p> }
          </Toast.Body>
        </Toast>
        { displayBackupRestoreModal && <BackupRestoreModal /> }
      </div>
    </div>
  );
};

export default App;
