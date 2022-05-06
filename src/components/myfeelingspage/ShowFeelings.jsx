/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { getAllFeelings } from '@api/FeelingsAPI';
import { darkModeState } from '../../store/DarkModeState';
import { HeaderDashboard } from '../dashboard/HeaderDashboard';
import { ShowFeelingTemplate } from './ShowFeelingTemplate';

import './AddFeelingsPage.scss';
import './ShowFeelings.scss';

export function ShowFeelings() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const [feelingsList, setFeelingsList] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates = allFeelings.reduce((dates, feeling) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      Object.keys(feelingsByDates).map((date) => (
        console.log(feelingsByDates[date])));
      setFeelingsList(feelingsByDates);
    };
    getData();
  }, []);
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
        <Row>
          <Col>
            <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>{t('showfeelingsmessage')}</h3>
            {feelingsList !== null && Object.keys(feelingsList).map((date) => (
              <div
                key={feelingsList[date]}
                className="show-feelings__list-category"
              >
                <h3 className={darkModeStatus
                  ? 'my-feelings-font-dark'
                  : 'my-feelings-font-light'}
                >
                  {new Date(date).toDateString()}
                </h3>
                <ShowFeelingTemplate
                  key={feelingsList[date]}
                  feelingCategory="Test"
                  feelingsListObject={feelingsList[date]}
                />
              </div>
            ))}
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
}
