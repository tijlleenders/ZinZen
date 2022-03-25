import React from "react";
import { useRecoilValue } from 'recoil';
import { Button, Nav, Navbar, Container} from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import "../../translations/i18n";
  
import { darkModeState } from '../../store/DarkModeState';

export const FeelingAngry = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    return (
        <div>
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                        {t("angry")}
                        &#128544;
                    </Button>
                    <br />
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("annoyed")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("frustrated")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("bitter")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("infuriated")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("mad")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("insulted")}
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                            {t("angry")}
                            &#128544;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("annoyed")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("frustrated")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("bitter")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("infuriated")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("mad")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("insulted")}
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    );
};
