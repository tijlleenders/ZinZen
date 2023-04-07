/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState, themeSelectionState, languageSelectionState, displayToast, lastAction, showConfirmation, backupRestoreModal } from "@store";

import { QueryPage } from "@pages/QueryPage/QueryPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import Contacts from "@pages/ContactsPage/Contacts";
import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import MyGroupsPage from "@pages/MyGroupsPage/MyGroupsPage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import { LandingPage } from "@pages/LandingPage/LandingPage";
import { ThemeChoice } from "@pages/ThemeChoice/ThemeChoice";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";

import BackupRestoreModal from "@components/BackupRestoreModal/BackupRestoreModal";
import { GoalItem } from "./models/GoalItem";
import { handleIncomingChanges } from "./helpers/InboxProcessor";
import { getContactSharedGoals } from "./services/contact.service";
import { addSharedWMGoal } from "./api/SharedWMAPI";
import { syncGroupPolls } from "./api/PublicGroupsAPI";
import { getContactByRelId, updateAllUnacceptedContacts } from "./api/ContactsAPI";

import "./global.scss";
import "./customize.scss";
import "@fontsource/montserrat";
import "bootstrap/dist/css/bootstrap.min.css";
import { findTypeOfSub } from "./api/PubSubAPI";

const App = () => {
  const theme = useRecoilValue(themeSelectionState);
  const language = useRecoilValue(languageSelectionState);
  const darkModeEnabled = useRecoilValue(darkModeState);
  const displayBackupRestoreModal = useRecoilValue(backupRestoreModal);
  const isThemeChosen = theme !== "No theme chosen.";
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
                const { goal } : { goal: GoalItem } = ele;
                goal.shared.contacts.push({ name: contactItem.name, relId });
                addSharedWMGoal(goal)
                  .then(() => console.log("goal added in inbox"))
                  .catch((err) => console.log("Failed to add in inbox", err));
              } else if (["shared", "collaboration", "collaborationInvite"].includes(ele.type)) {
                const typeOfSub = await findTypeOfSub(ele.rootGoalId) === "collaboration" ? "collaboration" : ele.type;
                handleIncomingChanges({ ...ele, type: typeOfSub }).then(() => setLastAction("goalNewUpdates"));
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
    } else {
      init();
    }
    if ((!isLanguageChosen || !isThemeChosen) && window.location.pathname !== "/" && window.location.pathname.toLowerCase() !== "/invest") { window.open("/", "_self"); }
  }, []);

  useEffect(() => {
    localStorage.setItem("confirmationState", JSON.stringify(confirmationState));
  }, [confirmationState]);
  return (
    <div className={darkModeEnabled ? "App-dark" : "App-light"}>
      <BrowserRouter>
        {isLanguageChosen && isThemeChosen}
        <Routes>
          {!isLanguageChosen ? (
            <Route path="/" element={<LandingPage />} />
          ) : !isThemeChosen ? (
            <Route path="/" element={<ThemeChoice />} />
          ) : (
            <Route path="/" element={<MyTimePage />} />
          )}
          <Route path="/Feedback" element={<FeedbackPage />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/MyGoals" element={<MyGoalsPage />} />
          <Route path="/MyGroups" element={<MyGroupsPage />} />
          <Route path="/MyJournal" element={<ShowFeelingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/QueryZinZen" element={<QueryPage />} />
          <Route path="/ZinZenFAQ" element={<FAQPage />} />
          <Route path="/invite/:id" element={<InvitePage />} />
          <Route path="/Invest" element={<InvestPage />} />
        </Routes>
      </BrowserRouter>
      <Toast autohide delay={5000} show={showToast.open} onClose={() => setShowToast({ ...showToast, open: false })} id={`toast${darkModeEnabled ? "-dark" : ""}`}>
        <Toast.Body>
          <p id="toast-message" style={showToast.extra === "" ? { margin: 0 } : {}}>{showToast.message}</p>
          { showToast.extra !== "" && <p id="extra-message">{showToast.extra}</p> }
        </Toast.Body>
      </Toast>
      { displayBackupRestoreModal && <BackupRestoreModal /> }
    </div>
  );
};

export default App;
