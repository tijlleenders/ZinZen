import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Container, Row } from 'react-bootstrap';

<<<<<<< HEAD
=======
import { darkModeState, themeSelectionState, languageSelectionState } from '@store';

>>>>>>> a65de9e832de5bbcfd7f09c49d326515a99cb251
import { LandingPage } from '@pages/LandingPage/LandingPage';
import { LandingPageThemeChoice } from '@pages/LandingPageThemeChoicePage/LandingPageThemeChoice';
import { AddFeelingsPage } from '@pages/AddFeelingsPage/AddFeelingsPage';
import { GoalsPage } from '@pages/GoalsPage/GoalsPage';
import { HomePage } from '@pages/HomePage/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage/NotFoundPage';
import { ZinZenMenuPage } from '@pages/ZinZenMenuPage/ZinZenMenuPage';
import { FeedbackPage } from '@pages/FeedbackPage/FeedbackPage';
import { ShowFeelingsPage } from '@pages/ShowFeelingsPage/ShowFeelingsPage';
import { ExplorePage } from '@pages/ExplorePage/ExplorePage';

<<<<<<< HEAD
import { languageSelectionState } from './store/LanguageSelectionState';
import { themeSelectionState } from './store/ThemeSelectionState';
import { darkModeState } from './store/DarkModeState';
=======
import { HeaderDashboard } from '@components/HeaderDashboard/HeaderDashboard';
>>>>>>> a65de9e832de5bbcfd7f09c49d326515a99cb251

import './customize.scss';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/montserrat';

export const App = () => {
  const darkModeEnabled = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeSelectionState);
  const isThemeChosen = theme !== 'No theme chosen.';
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== 'No language chosen.';
  return (
    <div className={darkModeEnabled ? 'App-dark' : 'App-light'}>
      {/* @ts-ignore */}
      <BrowserRouter>
        {(isLanguageChosen && isThemeChosen) && (
        <Container fluid>
          <Row>
            <HeaderDashboard />
          </Row>
        </Container>
        )}
        <Routes>
          {!isLanguageChosen ? (
            <Route path="/" element={<LandingPage />} />
          ) : !isThemeChosen ? (
            <Route
              path="/"
              element={<LandingPageThemeChoice />}
            />
          ) : (
            <>
              <Route path="/Home" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
            </>
          )}
          <Route
            path="/Home/AddFeelings"
            element={<AddFeelingsPage />}
          />
          <Route
            path="/Home/Explore"
            element={<ExplorePage />}
          />
          <Route
            path="/Home/ZinZen"
            element={<ZinZenMenuPage />}
          />
          <Route
            path="/Home/ZinZen/Feedback"
            element={<FeedbackPage />}
          />
          <Route
            path="/Home/MyGoals"
            element={<GoalsPage />}
          />
          <Route
            path="/Home/MyFeelings"
            element={<ShowFeelingsPage />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
