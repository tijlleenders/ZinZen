import { completeOnboarding } from "./landing-page.spec";

describe("Inbox component", () => {
  before(() => {
    // Set the upgrade available flag in localStorage
    localStorage.setItem("updateAvailable", "true");
    completeOnboarding();
    cy.visit("/MyGoals");
    cy.get(".header-items")
      .find(".header-icon[alt='zinzen inbox']")
      .click();
  });
  it("should render the upgrade message when an upgrade is available", () => {
    // Assert that the upgrade message is displayed
    cy.contains("Notifications").click();

    cy.get(".notification-item") // Check if the notification item is rendered
      .should("exist")
      .contains("Update Available !!"); // Check if the notification text is correct

    cy.get(".default-btn") // Check if the update button is rendered
      .should("exist")
      .contains("Update Now"); // Check if the button text is correct
  });

  // it('triggers update when the "Update Now" button is clicked', () => {
  //   cy.contains("Update Now").click(); // Click the "Update Now" button
  //   cy.get(".notification-item") // Check if the notification item is rendered
  //     .should("not.exist");
  // });
});
