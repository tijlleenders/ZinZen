import React from "react";
import { Button, Nav, Navbar, Container} from 'react-bootstrap'
import { darkModeState } from '../../store/DarkModeState'
import { useRecoilValue } from 'recoil'

export const FeelingHappy = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    return (
        <div>
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                        Happy
                        &#128515;
                    </Button>
                    <br />
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Happy
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Loved
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Relieved
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Content
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Peaceful
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Joyful
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                            Happy
                            &#128515;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Happy
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Loved
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Relieved
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Content
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Peaceful
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Joyful
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    );
};
