/// <reference types="cypress" />
localStorage.setItem('theme', 'light');
const theme = localStorage.getItem('theme');
if (theme) {
  describe('Basic Tests Dashboard', () => {
    it('nav-bar should work', () => {
      cy.visit('/');
      cy.contains('Home');
      cy.contains('Discover');
      cy.contains('Donate');
    });
    it('Dashboard should work', () => {
      cy.visit('/home');
      cy.contains('My Goals');
    });
  });
}
