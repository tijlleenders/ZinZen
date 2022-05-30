/// <reference types="cypress" />
describe('Basic Tests Home Page', () => {
  it('should have Home Page title', () => {
    cy.visit('/');
    cy.get('[alt="ZinZen Logo"]').should('be.visible');
    cy.get('[alt="ZinZen Text Logo"]').should('be.visible');
    cy.contains('Realize');
    cy.contains('dreams');
    cy.contains('together');
  });

  it('should have Learn More button', () => {
    cy.contains('Learn More').click();
  });

  it('should display the book icon', () => {
    cy.get('[alt="Book Icon"]').should('be.visible');
  });
  it('user choice panel for language choice should work', () => {
    cy.get('*[class^="right-panel-font"]').should('be.visible');
  });
});
