import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { darkModeState } from '@store';
import { truncateContent } from '@utils';

import '@translations/i18n';

export const queryUserChoicePanel = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const darkModeStatus = useRecoilValue(darkModeState);
  
    return (
      <div className="slide">
        <Container fluid>
          <Row>
            <Button
              variant={darkModeStatus ? 'brown' : 'peach'}
              size="lg"
              className={darkModeStatus ? 'query-choice-dark1' : 'query-choice-light1'}
              onClick={() => {
                navigate('/ZinZenFAQ');
              }}
            >
              {truncateContent(t('mygoals'))}
            </Button>
            <Button
              variant={darkModeStatus ? 'brown' : 'peach'}
              size="lg"
              className={darkModeStatus ? 'query-choice-dark1' : 'query-choice-light1'}
              onClick={() => {
                navigate('/Home');
              }}
            >
              {truncateContent(t('myfeelings'))}
            </Button>
          </Row>
        </Container>
    </div>
     );
    };
    