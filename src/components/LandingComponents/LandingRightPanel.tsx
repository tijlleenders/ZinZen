import React from 'react';
import { useTranslation } from 'react-i18next';

import { ILanguage } from '@src/Interfaces';
import { LanguagesList } from '@components/LanguageChoice/LanguagesList';

import '@translations/i18n';
import './LandingComponents.scss';

export const LandingRightPanel = () => {
  const { t } = useTranslation();

  const languages : ILanguage[] = [
    {
      sno: 1,
      title: t('english'),
      langId: 'en',
    },
    {
      sno: 2,
      title: t('french'),
      langId: 'fr',
    },
    {
      sno: 3,
      title: t('dutch'),
      langId: 'nl',
    },
    {
      sno: 4,
      title: t('hindi'),
      langId: 'hi',
    },
    {
      sno: 5,
      title: t('spanish'),
      langId: 'es',
    },
    {
      sno: 6,
      title: t('german'),
      langId: 'de',
    },
  ];
  return (
    <div className="right-panel">
      <h3 className="right-panel-font">
        {t('langchoice')}
      </h3>
      <LanguagesList languages={languages} />
    </div>
  );
};
