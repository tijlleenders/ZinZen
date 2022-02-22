import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import Logo from '../images/logo.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import "../translations/i18n"

const Header = () => {
    const { t } = useTranslation();
    return (
            <Navbar collapseOnSelect expand="lg">
                <img src={Logo} alt="ZinZen Logo" className="zinzen-logo-nav" />
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="navbar-custom">
                        <Nav.Link href="#features" className="nav-link">{t("home")}</Nav.Link>
                        <Nav.Link href="#pricing" className="nav-link">{t("discover")}</Nav.Link>
                        <Nav.Link href="#deets" className="nav-link">{t("donate")}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    )
}

export default Header
