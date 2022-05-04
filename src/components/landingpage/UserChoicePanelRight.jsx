import React from 'react';
import { useTranslation } from 'react-i18next';

import { LanguagesList } from '../languagechoices/LanguagesList';
import '../../translations/i18n';
import './landingpage.scss';

export function UserChoicePanelRight() {
  const { t } = useTranslation();

  const languages = [
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
  ];
  return (
    <div className="right-panel">
      <h3 className="right-panel-font">
        {t('langchoice')}
      </h3>
      <LanguagesList languages={languages} />
    </div>
  );
}
