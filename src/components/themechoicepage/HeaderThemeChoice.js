import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import ZinZenText from "../../images/LogoTextLight.svg";
import Logo from "../../images/zinzenlogo.png";
import "../../translations/i18n";
import "./themechoice.scss"

export const HeaderThemeChoice = () => {
    const { t } = useTranslation();
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
            <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="nav-collapse"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="navbar-custom">
                    <Nav.Link to="home" className="nav-link-theme-page">
                        {t("home")}
                    </Nav.Link>
                    <Nav.Link
                        href="#discover"
                        className="nav-link-theme-page"
                    >
                        {t("discover")}
                    </Nav.Link>
                    <Nav.Link href="#donate" className="nav-link-theme-page">
                        {t("donate")}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
