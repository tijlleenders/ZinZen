import React, { useEffect } from "react";

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
import { v4 as uuidv4 } from 'uuid';


const App = () => {
  const darkModeEnabled = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeSelectionState);
  const isThemeChosen = theme !== "No theme chosen.";
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";

  useEffect(() => {
    const installId = localStorage.getItem("installId");
    if (!installId) localStorage.setItem("installId", uuidv4());
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
            <>
              <Route path="/" element={<MyTimePage />} />
              <Route path="/Home/MyTime" element={<MyTimePage />} />
            </>
          )}
          <Route path="/Home/AddFeelings" element={<AddFeelingsPage />} />
          <Route path="/Home/ZinZen/Feedback" element={<FeedbackPage />} />
          <Route path="/Home/MyGoals" element={<MyGoalsPage />} />
          <Route path="/Home/MyFeelings" element={<ShowFeelingsPage />} />
          <Route path="Home/Contacts" element={<Contacts />} />
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
