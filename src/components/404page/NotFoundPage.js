import React from 'react'
import { HeaderDashboard } from "../dashboard/HeaderDashboard";
import { Container, Row, Button, Col } from "react-bootstrap";
import { useRecoilValue } from 'recoil';
import { useNavigate } from "react-router-dom";
import { darkModeState } from "../../store/DarkModeState";

import './errorPage.scss'

export const NotFoundPage = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    const navigate = useNavigate();

    return (
        <div>
            <Container fluid >
                <Row >
                    <HeaderDashboard />
                </Row>
                <Row></Row>
                <Row></Row>
                <Row >
                    <h1 className='error-heading'>404 Error</h1>
                    <h3 className='error-text'>Page Not Found</h3>
                <Col sm={1}>
                <Button
                variant={darkModeStatus ?  "dark-pink" : "pink"}
                size="lg"
                className={
                    darkModeStatus
                        ? "error-btn-dark"
                        : "error-btn-light"
                }
                onClick={() => {
                    navigate("/Home");
                    window.location.reload(false);
                }}>
                    Home
                </Button>
                </Col>
               
                </Row>
            </Container>
        </div>
    )
}

