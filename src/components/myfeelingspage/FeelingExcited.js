import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';


const FeelingExcited = () => {
    return (
        <div >
        <Container fluid>
            <div className="feelings-menu-desktop">
                <Button variant="peach" size="lg" className="feelings-title">
                    Excited
                    &#128516;
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Excited
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Amused
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Top of the world
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Proud
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Compassionate
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Cheerful
                </Button>
            </div>
            <div className="feelings-menu-mobile">
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Toggle className="feelings-title">
                        Excited
                        &#128516;
                    </Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className="navbar-custom">
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Excited
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Amused
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Top of the world
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Proud
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Compassionate
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
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
