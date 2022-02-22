import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import "../translations/i18n"

const Header = () => {
    const { t } = useTranslation();
    return (
        
            <Navbar collapseOnSelect expand="lg">
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
