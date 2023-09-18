import { completeOnboarding } from "./landing-page.spec";

describe("Header component", () => {
  before(() => {
    completeOnboarding();
  });

  it("should display the title correctly", () => {
    cy.visit("/MyGoals");
    cy.get(".header h6").should("have.text", "My Goals");
  });

  it("should show search input when search icon is clicked", () => {
    cy.get(".header-items").find(".header-icon[alt='zinzen search']").click();

    cy.get(".header-search").should("be.visible");
    cy.go("back");
  });

  it("should open settings dropdown when settings icon is clicked", () => {
    cy.get(".header-items").find(".header-icon[alt='zinzen settings']").click();

    cy.get(".header-dropdown").should("be.visible");
  });

  it("should close settings dropdown when clicked outside", () => {
    cy.get(".header-items").find(".header-icon[alt='zinzen settings']").click();

    cy.get("body").click("bottom"); // Click outside the dropdown

    cy.get(".header-dropdown").should("not.be.visible");
  });

  it("should toggle dark mode when Switch Mode button is clicked", () => {
    cy.get(".header-items").find(".header-icon[alt='zinzen settings']").click();

    cy.contains("Dark Mode").click();

    // Assert that dark mode is enabled
    cy.get(".App-dark").should("be.visible");
    cy.get(".App-light").should("not.exist");

    cy.get(".header-items").find(".header-icon[alt='zinzen settings']").click();

    cy.contains("Dark Mode").click();

    // Assert that dark mode is disabled and light mode is enabled
    cy.get(".App-dark").should("not.exist");
    cy.get(".App-light").should("be.visible");
  });

  it("should only display Zinzen settings on MyJournal or My Time page", () => {
    const checkHeaderItems = () => {
      cy.get(".header-items .header-icon[alt='zinzen settings']").should("be.visible");
      cy.get(".header-items .header-icon[alt='zinzen inbox']").should("not.exist");
      cy.get(".header-items .header-icon[alt='zinzen search']").should("not.exist");
    };

    cy.contains("Journal").click();
    checkHeaderItems();

    cy.contains("Schedule").click();
    checkHeaderItems();
  });
});
