import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';

import { getJustDate } from '@utils';
import { darkModeState } from '@store';
import { HeaderDashboard } from '@components/HeaderDashboard/HeaderDashboard';
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
      <Container fluid>
        <Row className="position">
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
