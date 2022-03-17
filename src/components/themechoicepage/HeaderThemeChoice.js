import React, { useState } from "react";
import {Nav, Navbar} from 'react-bootstrap';
import ZinZenText from '../../images/LogoTextLight.svg'
import Logo from '../../images/zinzenlogo.png'
import { useTranslation } from "react-i18next";
import "../../translations/i18n"

const HeaderThemeChoice = () => {
    const { t } = useTranslation();
    return (
            <Navbar collapseOnSelect expand="lg">
                <img src={Logo} alt="Text Nav" className="zinzen-logo-nav-dashboard"  />
                <img src={ZinZenText} alt="Logo Nav"  className="zinzen-text-logo-nav-dashboard" />
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className="nav-collapse"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="navbar-custom">
                    <Nav.Link to="home" className="nav-link-landing-page">{t("home")}</Nav.Link>
                        <Nav.Link href="#discover" className="nav-link-landing-page">{t("discover")}</Nav.Link>
                        <Nav.Link href="#donate" className="nav-link-landing-page">{t("donate")}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    )
}

export default HeaderThemeChoice