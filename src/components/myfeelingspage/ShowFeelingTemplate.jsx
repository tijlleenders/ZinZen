/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

// import { addFeeling } from '@api/FeelingsAPI';
import { darkModeState } from '@store';

import '@translations/i18n';
import './AddFeelingsPage.scss';

export function ShowFeelingTemplate({ feelingCategory, feelingsListObject }) {
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
          {feelingsListObject && Object.keys(feelingsListObject).map(((feelingObject) => (
            <Button
              key={feelingsListObject[feelingObject].feelingContent}
              className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
              size="lg"
              onClick={() => console.log('TODO: Add remove feeling function')}
            >
              {t(feelingsListObject[feelingObject].feelingContent)}
            </Button>
          )))}
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Toggle className={darkModeStatus ? 'feelings-title-dark' : 'feelings-title-light'}>
              {t(feelingCategory)}
              &#128515;
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav className="navbar-custom">
                {feelingsListObject && Object.keys(feelingsListObject).map(((feelingObject) => (
                  <Button
                    key={feelingsListObject[feelingObject].feelingContent}
                    className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
                    size="lg"
                    onClick={() => console.log('TODO: Add remove feeling function')}
                  >
                    {t(feelingsListObject[feelingObject].feelingContent)}
                  </Button>
                )))}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
}
