import React from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import Health from '@assets/images/health-fitness-goals.jpg';
import Career from '@assets/images/career-goals.jpg';
import MindAndSpirit from '@assets/images/mind-spirit-goals.jpg';
import Nature from '@assets/images/nature-environment-goals.jpg';
import PersonalGrowth from '@assets/images/personalGrowth-goals.jpg';
import Relationship from '@assets/images/relationship-goals.jpg';
import { HeaderDashboard } from '@components/dashboard/HeaderDashboard';
import { darkModeState } from '@src/store';

import '@translations/i18n';
import './explorepage.scss';

export function ExplorePage() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const goals:any = [
    { goalName: 'Health and Fitness Goals', goalImage: Health },
    { goalName: 'Relationship Goals', goalImage: Relationship },
    { goalName: 'Mind and Spirit Goals', goalImage: MindAndSpirit },
    { goalName: 'Career Goals', goalImage: Career },
    { goalName: 'Nature and Environment Goals', goalImage: Nature },
    { goalName: 'Personal Growth and Learning Goals', goalImage: PersonalGrowth }];
  const { t } = useTranslation();

  return (
    <div id={`explore-container-${darkModeStatus ? 'dark' : 'light'}`}>
      <Container fluid>
        <HeaderDashboard />
        <div id="goals-container">
          {goals.map((goal:any) => (
            <div className="goal-row">
              <div className="goal-card">
                <img className="goal-img" alt="my-goals" src={goal.goalImage} />
                <div className="goal-title">{t(goal.goalName)}</div>
                <h1 className="addGoal-btn">+</h1>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
