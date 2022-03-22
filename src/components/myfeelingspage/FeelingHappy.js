import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';

const FeelingHappy = () => {
    return (
       <div >
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant="peach" size="lg" className="feelings-title">
                        Happy
                        &#128515;
                    </Button>
                    <br />
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Happy
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Loved
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Relieved
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Content
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Peaceful
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Joyful
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className="feelings-title">
                            Happy
                            &#128515;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Happy
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Loved
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Relieved
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Content
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Peaceful
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Joyful
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    )
}

export default FeelingHappy
