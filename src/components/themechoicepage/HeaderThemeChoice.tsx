import React from 'react';
import { Navbar } from 'react-bootstrap';

import ZinZenText from '@assets/images/LogoTextLight.svg';
import Logo from '@assets/images/zinzenlogo.png';
import './themechoice.scss';

export function HeaderThemeChoice() {
  return (
    <Navbar collapseOnSelect expand="lg">
      <img
        src={Logo}
        alt="Text Nav"
        className="zinzen-logo-nav-theme-choice"
      />
      <img
        src={ZinZenText}
        alt="Logo Nav"
        className="zinzen-text-logo-nav-theme-choice"
      />
    </Navbar>
  );
}
