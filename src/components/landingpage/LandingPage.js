import React from "react";
import { Container, Row } from "react-bootstrap";
import { Header } from "./Header";
import { Mainbody } from "./Main-body";

export const LandingPage = () => {
    return (
        <div>
            <div>
                <Container fluid>
                    <Row>
                        <Header />
                    </Row>
                    <Row>
                        <Mainbody />
                    </Row>
                </Container>
            </div>
        </div>
    );
};
