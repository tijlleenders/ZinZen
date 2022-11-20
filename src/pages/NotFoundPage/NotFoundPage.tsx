import React from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import "./NotFoundPage.scss";

export const NotFoundPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const navigate = useNavigate();

  return (
    <div>
      <Container fluid>
        <Row />
        <Row />
        <Row />
        <Row>
          <h1 className="error-heading">404 Error</h1>
          <h3 className="error-text">Page Not Found</h3>
          <Col sm={1}>
            <Button
              variant={darkModeStatus ? "dark-pink" : "pink"}
              size="lg"
              className={darkModeStatus ? "error-btn-dark" : "error-btn-light"}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
