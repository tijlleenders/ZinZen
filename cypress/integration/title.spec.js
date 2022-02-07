/// <reference types="cypress" />
it("shows title", () => {
    cy.visit("/")
    cy.contains("ZinZen")
});