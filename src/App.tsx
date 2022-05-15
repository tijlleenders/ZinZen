import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { darkModeState } from './store/DarkModeState';
import { themeSelectionState } from './store/ThemeSelectionState';
import { languageSelectionState } from './store/LanguageSelectionState';

import { LandingPage } from '@pages/LandingPage/LandingPage';
import { LandingPageThemeChoice } from '@pages/ThemeChoicePage/LandingPageThemeChoice';
import { AddFeelings } from '@pages/AddFeelingsPage/AddFeelings';
import { TodoList } from '@pages/TodoListPage/TodoList';
import { Home } from '@pages/HomePage/Home';
import { NotFoundPage } from '@pages/NotFoundPage/NotFoundPage';
import { ZinZenMenu } from '@pages/ZinZenMenuPage/ZinZenMenu';
import { FeedbackPage } from '@pages/FeedbackPage/FeedbackPage';
import { ShowFeelings } from '@components/myfeelingspage/ShowFeelings';

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
            element={<AddFeelings />}
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
          <Route
            path="/Home/MyFeelings"
            element={<ShowFeelings />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
