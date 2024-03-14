import { completeOnboarding } from "./landing-page.spec";

describe("BottomNavbar", () => {
  before(() => {
    completeOnboarding();
    localStorage.setItem("theme", JSON.stringify({ light: 1, dark: 1 }));
  });

  it("should navigate to MyTime when Schedule button is clicked", () => {
    cy.get(".bottom-nav-item").contains("Schedule").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("should navigate to MyGoals when Goals button is clicked", () => {
    cy.get(".bottom-nav-item").contains("Goals").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/MyGoals`);
  });

  it("should navigate to MyJournal when Journal button is clicked", () => {
    cy.get(".bottom-nav-item").contains("Journal").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/MyJournal`);
  });

  it("should toggle dark mode when Switch Mode button is clicked", () => {
    cy.get(".header-items").find(".header-icon[alt='Settings']").click();

    // Click on the "Switch Mode" button to toggle the mode
    cy.contains("Change theme").click();
  });

  it("should change to next theme when Next button is clicked", () => {
    cy.get(".bottom-nav-item").contains("Next").click();
    cy.get(".dark-theme1").should("not.exist");
    cy.get(".dark-theme2").should("be.visible");
    // Assert that the previous page is navigated based on your implementation
  });

  it("should change back to previous theme when Prev button is clicked", () => {
    cy.get(".bottom-nav-item").contains("Prev").click();
    cy.get(".dark-theme2").should("not.exist");
    cy.get(".dark-theme1").should("be.visible");
  });
});
