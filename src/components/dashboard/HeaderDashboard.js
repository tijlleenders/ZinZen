import React, { useState } from "react";
import {Nav, Navbar} from 'react-bootstrap';
import ZinZenTextLight from '../../images/LogoTextLight.svg'
import ZinZenTextDark from '../../images/LogoTextDark.svg'
import Logo from '../../images/zinzenlogo.png'
import { useRecoilState } from 'recoil'
import { darkModeState } from '../../store/DarkModeState'
import DarkModeToggle from "react-dark-mode-toggle";
import { useTranslation } from "react-i18next";
import "../../translations/i18n"

const HeaderDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => false);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const { t } = useTranslation();
  return (
    <div>
      <Navbar collapseOnSelect expand="lg">
      <img src={Logo} alt="ZinZen Logo" className="zinzen-logo-nav-dashboard" />
      {darkModeStatus ? 
      <img src={ZinZenTextDark} alt="ZinZen Text Logo" className="zinzen-text-logo-nav-dashboard" /> :
      <img src={ZinZenTextLight} alt="ZinZen Text Logo" className="zinzen-text-logo-nav-dashboard" /> }

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="nav-collapse-dashboard"/>
        <Navbar.Collapse id="responsive-navbar-nav"> 
          <Nav className="navbar-custom">
            <Nav.Link href="#home" className={darkModeStatus ? "nav-link-dashboard-dark" : "nav-link-dashboard-light"}>{t("home")}</Nav.Link>
            <Nav.Link href="#discover" className={darkModeStatus ? "nav-link-dashboard-dark" : "nav-link-dashboard-light"}>{t("discover")}</Nav.Link>
            <Nav.Link href="#donate" className={darkModeStatus ? "nav-link-dashboard-dark" : "nav-link-dashboard-light"}>{t("donate")}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <DarkModeToggle 
                        onChange={setDarkModeStatus}
                        checked={darkModeStatus}
                        size={60}
                        className="dark-mode-toggle"
                    />
      </Navbar>
    </div>
  )
}

export default HeaderDashboard
