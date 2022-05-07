const lang = localStorage.getItem('language');
const theme = localStorage.getItem('theme');

test('No language or theme chosen', () => {
  expect(lang).toBe('No language chosen.') && expect(theme).toBe('No theme chosen.');
});

test('Language is saved, theme choice page', () => {
  expect(lang).not.toBe('No language chosen.') && expect(theme).toBe('No theme chosen.');
});

test('Language and Theme saved', () => {
  expect(theme).not.toBe('No theme chosen.');
});
