import { completeOnboarding } from "./landing-page.spec";

describe("Faq Page", () => {
  before(() => {
    completeOnboarding();
  });

  it("should show 4 questions", () => {
    cy.visit("/ZinZenFAQ");
    cy.contains("What is ZinZen");
    cy.contains("Is it private");
    cy.contains("Is it expensive");
    cy.contains("Too good to be true?");
  });

  it("should collapse and uncollapse Faq accordion panels", () => {
    cy.get(".ant-collapse-item").should("have.class", "ant-collapse-item-active");

    // Click on the first panel to collapse it
    cy.get(".ant-collapse-expand-icon").first().click();

    // Assert that the first panel is collapsed
    cy.get(".ant-collapse-item").first().should("not.have.class", "ant-collapse-item-active");

    // Click on the first panel again to uncollapse it
    cy.get(".ant-collapse-expand-icon").first().click();

    // Assert that the first panel is uncollapsed
    cy.get(".ant-collapse-item").first().should("have.class", "ant-collapse-item-active");
  });
});
