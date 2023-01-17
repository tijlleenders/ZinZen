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
import { addColabInvitesInRelId, addSharedGoalsInRelId, getContactByRelId } from "./api/ContactsAPI";
import { updateColabStatusOfGoal } from "./api/GoalsAPI";
import { GoalItem } from "./models/GoalItem";
import { handleIncomingChanges } from "./helpers/CollaborationHandler";
import { getDefaultValueOfCollab } from "./utils";
import { createGoalObjectFromTags } from "./helpers/GoalProcessor";
import { getContactSharedGoals } from "./services/contact.service";

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
      const res = await getContactSharedGoals();
      // @ts-ignore
      const resObject = res.response.reduce((acc, curr) => ({ ...acc, [curr.relId]: [...(acc[curr.relId] || []), curr] }), {});
      if (res.success) {
        Object.keys(resObject).forEach(async (k: any) => {
          const goals: { id: string, goal: GoalItem }[] = [];
          const collaborateInvites: { id: string, goal: GoalItem }[] = [];
          const contactItem = await getContactByRelId(k);
          // @ts-ignore
          resObject[k].forEach(async (ele) => {
            if (ele.type === "shareGoal") {
              goals.push({ id: ele.goal.id, goal: createGoalObjectFromTags(ele.goal) });
            } else if (ele.type === "collaboration") {
              collaborateInvites.push({ id: ele.goal.id, goal: ele.goal });
            } else if (ele.type === "colabInviteResponse") {
              await updateColabStatusOfGoal(ele.goalId, ele.status === "accepted" ? {
                status: "accepted",
                newUpdates: false,
                allowed: false,
                relId: ele.relId,
                rootGoal: ele.goalId,
                name: contactItem?.name || "",
                notificationCounter: 0
              } : getDefaultValueOfCollab()).then(() => console.log("updated invite response"));
            } else if (ele.type === "collaborationChanges") {
              await handleIncomingChanges(ele).then(() => console.log("changes added"));
            }
          });
          if (collaborateInvites.length > 0) {
            addColabInvitesInRelId(k, collaborateInvites).then(() => console.log("success")).catch((err) => console.log(err));
          }
          if (goals.length > 0) {
            addSharedGoalsInRelId(k, goals).then(() => console.log("success")).catch((err) => console.log(err));
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
    if ((!isLanguageChosen || !isThemeChosen) && window.location.pathname !== "/" ) { window.open("/", "_self"); }
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
          <Route path="/MyGoals" element={<MyGoalsPage />} />
          <Route path="/MyFeelings" element={<ShowFeelingsPage />} />
          <Route path="/Contacts" element={<Contacts />} />
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
