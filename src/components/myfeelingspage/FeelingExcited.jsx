import React from 'react';
import {
  Button, Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import './myfeelingspage.scss';

import { darkModeState } from '../../store/DarkModeState';

export function FeelingExcited() {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? 'brown' : 'peach'} size="lg" className="feelings-title">
            {t('excited')}
            &#128516;
          </Button>
          <br />
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('excited')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('amused')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('topoftheworld')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('proud')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('compassionate')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('cheerful')}
          </Button>
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Toggle className={darkModeStatus ? 'feelings-title-dark' : 'feelings-title-light'}>
              {t('excited')}
              &#128516;
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav className="navbar-custom">
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('excited')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('amused')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('topoftheworld')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('proud')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('compassionate')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('cheerful')}
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
}
