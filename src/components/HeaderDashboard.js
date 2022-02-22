import React, { useState } from "react";
import {Nav, Navbar} from 'react-bootstrap';
import Logo from '../images/logo.svg'
import DarkModeToggle from "react-dark-mode-toggle";
import { useTranslation } from "react-i18next";
import "../translations/i18n"

const HeaderDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => false);
  const { t } = useTranslation();
  return (
    <div>
      <Navbar collapseOnSelect expand="lg">
      <img src={Logo} alt="ZinZen Logo" className="zinzen-logo-nav-dashboard" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-custom">
            <Nav.Link href="#features" className="nav-link">{t("home")}</Nav.Link>
            <Nav.Link href="#pricing" className="nav-link">{t("discover")}</Nav.Link>
            <Nav.Link href="#deets" className="nav-link">{t("donate")}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <DarkModeToggle
        onChange={setIsDarkMode}
        checked={isDarkMode}
        size={60}
      />
      </Navbar>
    </div>
  )
}

export default HeaderDashboard
