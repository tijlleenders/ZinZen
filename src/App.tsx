import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { darkModeState, themeSelectionState, languageSelectionState } from "@store";

import { LandingPage } from "@pages/LandingPage/LandingPage";
import { ThemeChoice } from "@pages/ThemeChoice/ThemeChoice";
import { AddFeelingsPage } from "@pages/AddFeelingsPage/AddFeelingsPage";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";
import { QueryPage } from "@pages/QueryPage/QueryPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import Contacts from "@pages/ContactsPage/Contacts";
import InvitePage from "@pages/InvitePage/InvitePage";

import "./customize.scss";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/montserrat";
import { addGoalInRelId, getContactByRelId, getContactSharedGoals } from "./api/ContactsAPI";
import { createGoal } from "./api/GoalsAPI";

const App = () => {
  const darkModeEnabled = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeSelectionState);
  const isThemeChosen = theme !== "No theme chosen.";
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";

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
          <Route path="/AddFeelings" element={<AddFeelingsPage />} />
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
    </div>
  );
};

export default App;
