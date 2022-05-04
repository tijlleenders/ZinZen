import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { darkModeState } from './store/DarkModeState';
import { themeSelectionState } from './store/ThemeSelectionState';
import { languageSelectionState } from './store/LanguageSelectionState';

import { LandingPage } from './components/landingpage/LandingPage';
import { LandingPageThemeChoice } from './components/themechoicepage/LandingPageThemeChoice';
import { MyFeelings } from './components/myfeelingspage/MyFeelings';
import { TodoList } from './components/todoList/TodoList';
import { Home } from './components/dashboard/Home';
import { NotFoundPage } from './components/404page/NotFoundPage';
import { ZinZenMenu } from './components/zinzen-menu/ZinZenMenu';
import { FeedbackPage } from './components/feedbackpage/FeedbackPage';

import './customize.scss';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/montserrat';

export function App() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const isThemeChosen = useRecoilValue(themeSelectionState);
  const isLanguageChosen = useRecoilValue(languageSelectionState);
  return (
    <div className={darkModeStatus ? 'App-dark' : 'App-light'}>
      <BrowserRouter>
        <Routes>
          {isLanguageChosen === 'No language chosen.' ? (
            <Route path="/" element={<LandingPage />} />
          ) : isThemeChosen === 'No theme chosen.' ? (
            <Route
              path="/"
              element={<LandingPageThemeChoice />}
            />
          ) : (
            <>
              <Route path="/Home" element={<Home />} />
              <Route path="/" element={<Home />} />
            </>
          )}
          <Route
            path="/Home/AddFeelings"
            element={<MyFeelings />}
          />
          <Route
            path="/Home/ZinZen"
            element={<ZinZenMenu />}
          />
          <Route
            path="/Home/ZinZen/Feedback"
            element={<FeedbackPage />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
          <Route
            path="/Home/MyGoals"
            element={<TodoList />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
