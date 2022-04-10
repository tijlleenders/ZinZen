import React from "react";
import { Navbar } from "react-bootstrap";

import "../../translations/i18n";
import ZinZenText from "../../images/LogoTextLight.svg";
import Logo from "../../images/zinzenlogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./landingpage.scss"
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();
    return (
        <Navbar collapseOnSelect expand="lg">
            <img src={Logo} 
                alt="Text Nav"
                className="zinzen-logo-nav-landing-page"
                onClick={() => {
                    navigate("/");
                    window.location.reload(false);
                }
                }
            />
            <img
                src={ZinZenText}
                alt="Logo Nav"
                className="zinzen-text-logo-nav-landing-page"
            />
        </Navbar>
    );
};
