import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

import { darkModeState } from '@store';

import logo from '@assets/images/logo.svg';
import ZinZenTextLight from '@assets/images/LogoTextLight.svg';
import ZinZenTextDark from '@assets/images/LogoTextDark.svg';
import ArrowIcon from '@assets/images/ArrowIcon.svg';
import '@translations/i18n';
import './HeaderDashboard.scss';

export const HeaderDashboard = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div className={darkModeStatus ? 'positioning-dark' : 'positioning-light'}>
      <Navbar collapseOnSelect expand="lg">
        <img
          role="presentation"
          src={darkModeStatus ? ArrowIcon : ArrowIcon}
          alt="Back Arrow"
          className="back-arrow-nav-dashboard"
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
        <img
          role="presentation"
          src={logo}
          alt="Zinzen Logo"
          className="zinzen-logo-nav-dashboard"
          onClick={() => {
            navigate('/Home');
          }}
        />
      </Navbar>
    </div>
  );
};
