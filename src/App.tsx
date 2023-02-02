/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast from "react-bootstrap/Toast";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState, themeSelectionState, languageSelectionState, displayToast } from "@store";

import { LandingPage } from "@pages/LandingPage/LandingPage";
import { ThemeChoice } from "@pages/ThemeChoice/ThemeChoice";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";
import { QueryPage } from "@pages/QueryPage/QueryPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import Contacts from "@pages/ContactsPage/Contacts";
import InvitePage from "@pages/InvitePage/InvitePage";
import { addColabInvitesInRelId, getContactByRelId, updateAllUnacceptedContacts } from "./api/ContactsAPI";
import { GoalItem } from "./models/GoalItem";
import { handleIncomingChanges } from "./helpers/InboxProcessor";
import { getContactSharedGoals } from "./services/contact.service";
import { addGoalsInSharedWM, addSharedWMGoal } from "./api/SharedWMAPI";

import "./customize.scss";
import "./global.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/montserrat";

const App = () => {
  const darkModeEnabled = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeSelectionState);
  const language = useRecoilValue(languageSelectionState);
  const isThemeChosen = theme !== "No theme chosen.";
  const isLanguageChosen = language !== "No language chosen.";

  const [showToast, setShowToast] = useRecoilState(displayToast);
  useEffect(() => {
    const init = async () => {
      updateAllUnacceptedContacts();
      const res = await getContactSharedGoals();
      // @ts-ignore
      const resObject = res.response.reduce((acc, curr) => ({ ...acc, [curr.relId]: [...(acc[curr.relId] || []), curr] }), {});
      if (res.success) {
        Object.keys(resObject).forEach(async (relId: string) => {
          const goals: GoalItem[] = [];
          const collaborateInvites: { id: string, goal: GoalItem }[] = [];
          const contactItem = await getContactByRelId(relId);
          if (contactItem) {
          // @ts-ignore
            resObject[relId].forEach(async (ele) => {
              if (ele.type === "shareGoal") {
                const { goal } : { goal: GoalItem } = ele;
                goal.shared.contacts.push({ name: contactItem.name, relId });
                addSharedWMGoal(goal)
                  .then(() => console.log("goal added in inbox"))
                  .catch((err) => console.log("Failed to add in inbox", err));
              } else if (["shared", "collaboration", "collaborationInvite"].includes(ele.type)) {
                handleIncomingChanges(ele);
              }
            });
            if (collaborateInvites.length > 0) {
              addColabInvitesInRelId(relId, collaborateInvites).then(() => console.log("success")).catch((err) => console.log(err));
            }
            if (goals.length > 0) {
              addGoalsInSharedWM(goals).then(() => console.log("success")).catch((err) => console.log(err));
            }
          }
        });
      }
    };
    const installId = localStorage.getItem("installId");
    if (!installId) {
      localStorage.setItem("installId", uuidv4());
    } else {
      init();
    }
    if ((!isLanguageChosen || !isThemeChosen) && window.location.pathname !== "/") { window.open("/", "_self"); }
  }, []);

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
          <Route path="/ZinZen/Feedback" element={<FeedbackPage />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/MyGoals" element={<MyGoalsPage />} />
          <Route path="/MyFeelings" element={<ShowFeelingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/QueryZinZen" element={<QueryPage />} />
          <Route path="/ZinZenFAQ" element={<FAQPage />} />
          <Route path="/invite/:id" element={<InvitePage />} />
        </Routes>
      </BrowserRouter>
      <Toast autohide delay={5000} show={showToast.open} onClose={() => setShowToast({ ...showToast, open: false })} id={`toast${darkModeEnabled ? "-dark" : ""}`}>
        <Toast.Body>
          <p id="toast-message" style={showToast.extra === "" ? { margin: 0 } : {}}>{showToast.message}</p>
          { showToast.extra !== "" && <p id="extra-message">{showToast.extra}</p> }
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default App;
