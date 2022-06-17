// @ts-nocheck
import React from "react";
import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "@translations/i18n";
import ZinZenText from "@assets/images/LogoTextLight.svg";
import Logo from "@assets/images/zinzenlogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingComponents.scss";

export const MobileHeader = () => {
  const navigate = useNavigate();
  return (
    <Navbar collapseOnSelect expand="lg">
      <img
        role="presentation"
        src={Logo}
        alt="Text Nav"
        className="zinzen-logo-nav-landing-page"
        onClick={() => {
          navigate("/");
        }}
      />
      <img src={ZinZenText} alt="Logo Nav" className="zinzen-text-logo-nav-landing-page" />
    </Navbar>
  );
};
