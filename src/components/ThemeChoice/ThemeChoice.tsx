import React from 'react';
import { useRecoilState } from 'recoil';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { themeSelectionState, darkModeState } from '@store';

import ThemeDark from '@assets/images/DashboardThemeDark.svg';
import ThemeLight from '@assets/images/DashboardThemeLight.svg';
import './ThemeChoice.scss';

export const ThemeChoice = () => {
  const [, setIsThemeChosen] = useRecoilState(themeSelectionState);
  const [, setDarkModeStatus] = useRecoilState(darkModeState);
  const navigate = useNavigate();
  return (
    <div className="themerow">
      <Button
        variant="primary"
        size="lg"
        className="theme-choice-btn"
        onClick={() => {
          setIsThemeChosen(true);
          localStorage.setItem('theme', 'light');
          navigate('/Home');
        }}
      >
        <img
          src={ThemeLight}
          alt="Light Theme"
          className="themechoice"
        />
      </Button>
      <br />
      <br />
      <Button
        variant="primary"
        size="lg"
        className="theme-choice-btn"
        onClick={() => {
          setIsThemeChosen(true);
          localStorage.setItem('theme', 'dark');
          navigate('/Home');
          setDarkModeStatus(true);
        }}
      >
        <img src={ThemeDark} alt="Dark Theme" className="themechoice" />
      </Button>
    </div>
  );
};
