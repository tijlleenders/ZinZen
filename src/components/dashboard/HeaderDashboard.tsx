import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import DarkModeToggle from 'react-dark-mode-toggle';
import { useNavigate } from 'react-router-dom';

import { darkModeState } from '@store';

import ZinZenTextLight from '@assets/images/LogoTextLight.svg';
import ZinZenTextDark from '@assets/images/LogoTextDark.svg';
import Logo from '@assets/images/zinzenlogo.png';
import '@translations/i18n';

export function HeaderDashboard() {
  const navigate = useNavigate();
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const toggleTheme = () => {
    setDarkModeStatus(!darkModeStatus);
    if (darkModeStatus) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  };
  return (
    <div>
      <Navbar collapseOnSelect expand="lg">
        <img
          role="presentation"
          src={Logo}
          alt="ZinZen Logo"
          className="zinzen-logo-nav-dashboard"
          onClick={() => {
            navigate('/Home');
          }}
        />
        {darkModeStatus ? (
          <img
            role="presentation"
            src={ZinZenTextDark}
            alt="ZinZen Text Logo"
            className="zinzen-text-logo-nav-dashboard"
            onClick={() => {
              navigate('/Home');
            }}
          />
        ) : (
          <img
            role="presentation"
            src={ZinZenTextLight}
            alt="ZinZen Text Logo"
            className="zinzen-text-logo-nav-dashboard"
            onClick={() => {
              navigate('/Home');
            }}
          />
        )}

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-custom" />
        </Navbar.Collapse>
        <DarkModeToggle
          onChange={toggleTheme}
          checked={darkModeStatus}
          size={60}
          className="dark-mode-toggle"
        />
      </Navbar>
    </div>
  );
}
