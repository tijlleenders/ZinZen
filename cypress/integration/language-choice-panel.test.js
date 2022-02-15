/// <reference types="cypress" />
describe('Basic Tests Language Choice', () => {
    it("user choice panel should work", () => {
        cy.contains("Choose your preferred Language")
        cy.contains("Language").click()
    });
});
