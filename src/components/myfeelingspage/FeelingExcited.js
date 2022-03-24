import React from 'react'
import { Button, Nav, Navbar, Container} from 'react-bootstrap'
import { darkModeState } from '../../store/DarkModeState'
import { useRecoilState } from 'recoil'


const FeelingExcited = () => {
    const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
    return (
        <div >
        <Container fluid>
            <div className="feelings-menu-desktop">
                <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                    Excited
                    &#128516;
                </Button>
                <br />
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Excited
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Amused
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Top of the world
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Proud
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Compassionate
                </Button>
                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                    Cheerful
                </Button>
            </div>
            <div className="feelings-menu-mobile">
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                        Excited
                        &#128516;
                    </Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className="navbar-custom">
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Excited
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Amused
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Top of the world
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Proud
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Compassionate
                            </Button>
                            <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                Cheerful
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </Container>
    </div>
    )
}

export default FeelingExcited
