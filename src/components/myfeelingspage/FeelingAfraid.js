import React from "react";
import { Button, Nav, Navbar, Container} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import { darkModeState } from '../../store/DarkModeState';

export const FeelingAfraid = () => {
    return (
        <div >
        <Container fluid>
            <div className="feelings-menu-desktop">
                <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                    Afraid
                    &#128552;
                </Button>
                <br />
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Worried
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Doubtful
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Nervous
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Anxious
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Panicked
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Stressed
                </Button>
            </div>
            <div className="feelings-menu-mobile">
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                        Afraid
                        &#128552;
                    </Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className="navbar-custom">
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Worried
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Doubtful
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Nervous
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Anxious
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Panicked
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Stressed
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </Container>
    </div>
    )
}
