import React from "react";
import { Container, Row } from "react-bootstrap";

import { LandingContainer } from "@components/LandingComponents/LandingContainer";
import { MobileHeader } from "@components/LandingComponents/MobileHeader";
import "@components/LandingComponents/LandingComponents.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.scss";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const LandingPage = () => (
  <div>
    <Container fluid>
      <Row>
        <MainHeaderDashboard />
      </Row>
    </Container>
    <Container fluid className="landing-page__container">
      <Row>
        <MobileHeader />
      </Row>
      <Row>
        <LandingContainer />
      </Row>
    </Container>
  </div>
);
