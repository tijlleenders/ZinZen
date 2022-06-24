import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { darkModeState, themeSelectionState, languageSelectionState } from "@store";

import { LandingPage } from "@pages/LandingPage/LandingPage";
import { LandingPageThemeChoice } from "@pages/LandingPageThemeChoicePage/LandingPageThemeChoice";
import { AddFeelingsPage } from "@pages/AddFeelingsPage/AddFeelingsPage";
import { HomePage } from "@pages/HomePage/HomePage";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";
import { ZinZenMenuPage } from "@pages/ZinZenMenuPage/ZinZenMenuPage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { ShowFeelingsPage } from "@pages/ShowFeelingsPage/ShowFeelingsPage";
import { ExplorePage } from "@pages/ExplorePage/ExplorePage";
import { MyGoalsPage } from "@pages/MyGoalsPage/MyGoalsPage";
import { QueryPage } from "@pages/QueryPage/QueryPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import { AddGoalsPage } from "@pages/AddGoalsPage/AddGoalsPage";
import { GoalSublist } from "@pages/GoalSublist/GoalSublist";

import "./customize.scss";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/montserrat";

const App = () => {
  const darkModeEnabled = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeSelectionState);
  const isThemeChosen = theme !== "No theme chosen.";
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";
  return (
    <div className={darkModeEnabled ? "App-dark" : "App-light"}>
      <BrowserRouter>
        {isLanguageChosen && isThemeChosen}
        <Routes>
          {!isLanguageChosen ? (
            <Route path="/" element={<LandingPage />} />
          ) : !isThemeChosen ? (
            <Route path="/" element={<LandingPageThemeChoice />} />
          ) : (
            <>
              <Route path="/Home" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
            </>
          )}
          <Route path="/Home/AddFeelings" element={<AddFeelingsPage />} />
          <Route path="/Home/AddGoals" element={<AddGoalsPage />} />
          <Route path="/Home/Explore" element={<ExplorePage />} />
          <Route path="/Home/ZinZen" element={<ZinZenMenuPage />} />
          <Route path="/Home/ZinZen/Feedback" element={<FeedbackPage />} />
          <Route path="/Home/MyGoals" element={<MyGoalsPage />} />
          <Route path="/Home/MyGoals/:id" element={<GoalSublist />} />
          <Route path="/Home/MyFeelings" element={<ShowFeelingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/QueryZinZen" element={<QueryPage />} />
          <Route path="/ZinZenFAQ" element={<FAQPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
