/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { addFeeling } from '@api/FeelingsAPI';
import { darkModeState } from '@store';

import '@translations/i18n';
import './AddFeelingsPage.scss';

export function FeelingTemplate({ feelingCategory, feelingsList }) {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? 'brown' : 'peach'} size="lg" className="feelings-title">
            {t(feelingCategory)}
            &#128515;
          </Button>
          <br />
          {feelingsList.map((feelingName) => (
            <Button
              key={feelingName}
              className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
              size="lg"
              onClick={() => addFeeling(feelingName, feelingCategory)}
            >
              {t(feelingName)}
            </Button>
          ))}
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Toggle className={darkModeStatus ? 'feelings-title-dark' : 'feelings-title-light'}>
              {t(feelingCategory)}
              &#128515;
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav className="navbar-custom">
                {feelingsList.map((feelingName) => (
                  <Button
                    key={feelingName}
                    className={
                      darkModeStatus
                        ? 'btn-my-feelings-dark btn-feelings-dark'
                        : 'btn-my-feelings-light btn-feelings-light'
                    }
                    size="lg"
                  >
                    {t(feelingName)}
                  </Button>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
}
