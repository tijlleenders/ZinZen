/// <reference types="cypress" />
describe('Basic Tests Home Page', () => {

    it("nav-bar should work", () => {
        cy.visit("/")
        cy.contains("Home")
        cy.contains("Discover")
        cy.contains("Donate")
    });

    it("should have Home Page title", () => {
        cy.visit("/")
        cy.contains("ZinZen")
        cy.contains("a platform")
    });

    it("should have Learn More button", () => {
        cy.contains("Learn More").click()
    });

    it("should display the book icon", () => {
        cy.get('[alt="Book Icon"]').should('be.visible');
    });
})
