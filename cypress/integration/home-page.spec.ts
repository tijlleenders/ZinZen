describe("Basic Tests Home Page", () => {
  it("should have Home Page title", () => {
    cy.visit("/");
    cy.clearLocalStorage();
    cy.get('[alt="ZinZen Text Logo"]').should("be.visible");
    cy.get('[alt="ZinZen Text Logo"]').should("be.visible");
    cy.contains("a platform for");
    cy.contains("self-actualization");
    cy.contains("and");
    cy.contains("collaboration");
  });

  it("should display the book icon", () => {
    cy.get('[alt="Book Icon"]').should("be.visible");
  });

  it("user choice panel for language choice should work", () => {
    cy.get(".containerLang").should("be.visible");
  });

  it("Theme & Language Selection", () => {
    cy.visit("/");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn").first().click();
  });

  it("Default entry page should be MyTime", () => {
    cy.contains("Skip Intro")
      .click()
      .location("pathname")
      .should("include", "MyTime");
  });
});
