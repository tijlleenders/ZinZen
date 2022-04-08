import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import "../../translations/i18n";
import ZinZenText from "../../images/LogoTextLight.svg";
import Logo from "../../images/zinzenlogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./landingpage.scss"

export const Header = () => {
    const { t } = useTranslation();
    return (
        <Navbar collapseOnSelect expand="lg">
            <img src={Logo} alt="Text Nav" className="zinzen-logo-nav-landing-page" />
            <img
                src={ZinZenText}
                alt="Logo Nav"
                className="zinzen-text-logo-nav-landing-page"
            />
            <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="nav-collapse-landing-page"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="navbar-custom-landing-page">
                    <Nav.Link 
                        href="https://zinzen.vercel.app"
                        className="nav-link-landing-page"
                    >
                        {t("home")}
                    </Nav.Link>
                    <Nav.Link
                        href="https://github.com/tijlleenders/ZinZen"
                        className="nav-link-landing-page"
                    >
                        {t("discover")}
                    </Nav.Link>
                    <Nav.Link
                        href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"
                        className="nav-link-landing-page"
                    >
                        {t("donate")}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
