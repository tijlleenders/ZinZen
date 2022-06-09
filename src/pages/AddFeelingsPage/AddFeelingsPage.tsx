import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';

import { HeaderDashboard } from '@components/HeaderDashboard/HeaderDashboard';
import { getJustDate } from '@utils';
import { darkModeState } from '@store';
import { AddFeelingsChoices } from './AddFeelingsChoices';

import '@translations/i18n';
import './AddFeelingsPage.scss';

export const AddFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const location = useLocation();
  const date = location?.state?.feelingDate !== undefined
    ? getJustDate(location?.state?.feelingDate)
    : getJustDate(new Date());
  return (

    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <Container fluid className="slide add-feelings__container">
        <Row>
          <Col>
            <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>
              {date.getTime() === getJustDate(new Date()).getTime() ? t('feelingsmessage') : `${t('feelingsMessagePast')} ${date.toDateString()}`}
            </h3>
            <AddFeelingsChoices date={date} />
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
};
