import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import DarkModeToggle from "react-dark-mode-toggle";

import { darkModeState } from "../../store/DarkModeState";
import ZinZenTextLight from "../../images/LogoTextLight.svg";
import ZinZenTextDark from "../../images/LogoTextDark.svg";
import Logo from "../../images/zinzenlogo.png";
import "../../translations/i18n";

export const HeaderDashboard = () => {
    const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
    const { t } = useTranslation();
    return (
        <div>
            <Navbar collapseOnSelect expand="lg">
                <img
                    src={Logo}
                    alt="ZinZen Logo"
                    className="zinzen-logo-nav-dashboard"
                />
                {darkModeStatus ? (
                    <img
                        src={ZinZenTextDark}
                        alt="ZinZen Text Logo"
                        className="zinzen-text-logo-nav-dashboard"
                    />
                ) : (
                    <img
                        src={ZinZenTextLight}
                        alt="ZinZen Text Logo"
                        className="zinzen-text-logo-nav-dashboard"
                    />
                )}

                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    className="nav-collapse-dashboard"
                />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="navbar-custom">
                        <Nav.Link
                            href="https://zinzen.vercel.app/Home"
                            className={
                                darkModeStatus
                                    ? "nav-link-dashboard-dark"
                                    : "nav-link-dashboard-light"
                            }
                        >
                            {t("home")}
                        </Nav.Link>
                        <Nav.Link
                            href="https://github.com/tijlleenders/ZinZen"
                            className={
                                darkModeStatus
                                    ? "nav-link-dashboard-dark"
                                    : "nav-link-dashboard-light"
                            }
                        >
                            {t("discover")}
                        </Nav.Link>
                        <Nav.Link
                            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"
                            className={
                                darkModeStatus
                                    ? "nav-link-dashboard-dark"
                                    : "nav-link-dashboard-light"
                            }
                        >
                            {t("donate")}
                        </Nav.Link>
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
    );
};
