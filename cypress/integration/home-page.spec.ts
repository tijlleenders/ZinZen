describe("Basic Tests Home Page", () => {
  it("should have Home Page title", () => {
    cy.visit("/MyGoals");
    cy.clearLocalStorage();
    cy.get('[alt="ZinZen Text Logo"]').should("be.visible");
    cy.contains("Realize");
    cy.contains("dreams");
    cy.contains("together");
  });

  it("user choice panel for language choice should work", () => {
    cy.visit("/MyGoals");
    cy.get(".containerLang").should("be.visible");
  });

  it("Language Selection & Theme Light", () => {
    cy.visit("/MyGoals");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn-light").first().click();
  });
  
  it("Language Selection & Theme Dark", () => {
    cy.visit("/MyGoals");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn-dark").first().click();
  });

  it("Default entry page", () => {
    cy.visit("/MyGoals");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn-light").first().click();
    cy.contains("Skip Intro")
      .click()
  });
});
