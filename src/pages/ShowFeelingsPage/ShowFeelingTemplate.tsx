/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Nav, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { darkModeState } from '@store';

import '@translations/i18n';
import './ShowFeelingsPage.scss';

interface IShowFeelingTemplateProp {
  id: number;
  category: string;
  content: string;
  date: Date;
}

export const ShowFeelingTemplate: React.FC<IShowFeelingTemplateProp> = ({ feelingsListObject }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          {feelingsListObject && Object.keys(feelingsListObject)
            .map(((feelingObject) => (
              <Button
                key={feelingsListObject[feelingObject].content}
                className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
                size="lg"
                onClick={() => console.log('TODO: Add remove feeling function')}
              >
                {t(feelingsListObject[feelingObject].content)}
              </Button>
            )))}
        </div>
        <div className="feelings-menu-mobile">
          <Nav className="navbar-custom">
            {feelingsListObject && Object.keys(feelingsListObject).map(((feelingObject) => (
              <Button
                key={feelingsListObject[feelingObject].content
                  + feelingsListObject[feelingObject].date}
                className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
                size="lg"
                onClick={() => console.log('TODO: Add remove feeling function')}
              >
                {t(feelingsListObject[feelingObject].content)}
              </Button>
            )))}
          </Nav>
        </div>
      </Container>
    </div>
  );
};
