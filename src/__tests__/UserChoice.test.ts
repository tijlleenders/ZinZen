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
// const theme = localStorage.getItem('theme');
// const lang = localStorage.getItem('language');

// test('No language or theme chosen', () => {
//   expect(lang).toBe('No language chosen.') && expect(theme).toBe('No theme chosen.');
// });

// test('Language is saved, theme choice page', () => {
//   expect(lang).not.toBe('No language chosen.') && expect(theme).toBe('No theme chosen.');
// });

// test('Language and Theme saved', () => {
//   expect(theme).not.toBe('No theme chosen.');
// });

// export {};
