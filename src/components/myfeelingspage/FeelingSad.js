import React from 'react'
import { Button, Nav, Navbar, Container} from 'react-bootstrap'
import { darkModeState } from '../../store/DarkModeState'
import { useRecoilState } from 'recoil'


const FeelingSad = () => {
    const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
    return (
        <div >
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                        Sad
                        &#128577;
                    </Button>
                    <br />
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Sad
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Lonely
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Gloomy
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Disappointed
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Miserable
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        Hopeless
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                            Sad
                            &#128577;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Sad
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Lonely
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Gloomy
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Disappointed
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Miserable
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    Hopeless
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    )
}

export default FeelingSad
