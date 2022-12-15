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
import { addGoalInRelId, getContactByRelId, getContactSharedGoals } from "./api/ContactsAPI";
import { createGoal } from "./api/GoalsAPI";

import "./customize.scss";
import "./App.scss";
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
      if (res.success) {
        console.log(res);
        res.response.forEach(async (ele: { relId: string; title: string; id: string }) => {
          const contact = await getContactByRelId(ele.relId);
          if (contact) {
            await addGoalInRelId(ele.relId, [...contact.goals,
              { id: ele.id, goal: createGoal(ele.title) }]);
            // await archiveRootGoalsByTitle(ele.title);
            // await addGoal({
            //   ...createGoal(ele.title),
            //   shared: { id: ele.id, name: contact?.name, relId: ele.relId } });
          }
        });
      }
    };
    const installId = localStorage.getItem("installId");
    if (!installId) localStorage.setItem("installId", uuidv4());
    else {
      init();
    }
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
          <p id="toast-message">{showToast.message}</p>
          { showToast.extra !== "" && <p id="extra-message">{showToast.extra}</p> }
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default App;
