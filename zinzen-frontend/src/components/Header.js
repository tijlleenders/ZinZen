import React, { useState } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import DarkModeToggle from "react-dark-mode-toggle";

const Header = () => {
        const [isDarkMode, setIsDarkMode] = useState(() => false);
        return (
                <div>
                        <Navbar bg="primary-base" variant="dark">
                                <Container>
                                        <Nav className="me-auto navbarCont">
                                                <Nav.Link href="#home" className="navbarCont">Home</Nav.Link>
                                                <Nav.Link href="#features">Features</Nav.Link>
                                                <Nav.Link href="#pricing">Pricing</Nav.Link>
                                                <DarkModeToggle
                                                        onChange={setIsDarkMode}
                                                        checked={isDarkMode}
                                                        size={70}
                                                />
                                        </Nav>
                                </Container>
                        </Navbar>
                </div>
        )
}

export default Header
