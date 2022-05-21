import { expect } from '@jest/globals';
import { languagesAvailable } from 'src/translations/i18n';

describe('Theme Chosen', () => {
  test('check chosen theme', () => {
    const chosenTheme = localStorage.getItem('theme');
    if (chosenTheme) { expect(['dark', 'light']).toContain(chosenTheme); }
  });
});

describe('Language Chosen', () => {
  test('check chosen theme', () => {
    const chosenLang = localStorage.getItem('language');
    if (chosenLang) { expect(languagesAvailable).toContain(chosenLang); }
  });
});
