import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AddIconLight from '@assets/images/AddIconLight.png';
import AddIconDark from '@assets/images/AddIconDark.png';
import { darkModeState } from '@store';

import '@translations/i18n';
import './dashboard.scss';

export function UserChoiceDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  function truncateContent(content: string, maxLength = 20) {
    const { length } = content;
    if (length >= maxLength) {
      return `${content.substring(0, maxLength)}...`;
    }
    return content;
  }

  return (
    <div>
      <Container fluid>

        <Row>
          <Button
            variant={darkModeStatus ? 'brown' : 'peach'}
            size="lg"
            className={
                            darkModeStatus
                              ? 'dashboard-choice-dark1'
                              : 'dashboard-choice-light1'
                        }
          >
            {truncateContent(t('mygoals'))}
          </Button>
          <Button
            variant={darkModeStatus ? 'brown' : 'peach'}
            className={
                            darkModeStatus
                              ? 'dashboard-add-btn-dark1'
                              : 'dashboard-add-btn-light1'
                        }
            onClick={() => {
              navigate('/Home/MyGoals');
            }}
          >
            {darkModeStatus ? (
              <img
                src={AddIconDark}
                alt="Add Icon"
                className="add-icon"
              />
            ) : (
              <img
                src={AddIconLight}
                alt="Add Icon"
                className="add-icon"
              />
            )}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? 'dark-pink' : 'pink'}
            size="lg"
            className={
                            darkModeStatus
                              ? 'dashboard-choice-dark'
                              : 'dashboard-choice-light'
                        }
            onClick={() => {
              navigate('/Home/MyFeelings');
            }}
          >
            {truncateContent(t('myfeelings'))}
          </Button>
          <Button
            variant={darkModeStatus ? 'dark-pink' : 'pink'}
            className={
                            darkModeStatus
                              ? 'dashboard-add-btn-dark'
                              : 'dashboard-add-btn-light'
                        }
            onClick={() => {
              navigate('/Home/AddFeelings');
            }}
          >
            {darkModeStatus ? (
              <img
                src={AddIconDark}
                alt="Add Icon"
                className="add-icon"
              />
            ) : (
              <img
                src={AddIconLight}
                alt="Add Icon"
                className="add-icon"
              />
            )}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? 'dark-grey' : 'grey-base'}
            size="lg"
            className={
                            darkModeStatus
                              ? 'dashboard-choice-dark no-add'
                              : 'dashboard-choice-light no-add'
                                }
          >
            {truncateContent(t('mytime'))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? 'dark-blue' : 'pale-blue'}
            size="lg"
            className={
                            darkModeStatus
                              ? 'dashboard-choice-dark no-add'
                              : 'dashboard-choice-light no-add'
                        }
            onClick={() => {
              navigate('');
            }}
          >
            {truncateContent(t('explore'))}
          </Button>
        </Row>
        <Row>
          <Button
            variant={darkModeStatus ? 'dark-purple' : 'purple'}
            size="lg"
            className={
                            darkModeStatus
                              ? 'dashboard-choice-dark no-add'
                              : 'dashboard-choice-light no-add'
                        }
            onClick={() => {
              navigate('/Home/ZinZen');
            }}
          >
            {truncateContent(t('zinzen'))}
          </Button>
        </Row>
      </Container>
    </div>
  );
}
