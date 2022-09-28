describe("DashboardUserChoice Test", () => {
  it("Should have 5 Choices to navigate My Goals/My Feelings/My Time/Explore/ZinZen", () => {
    cy.visit("/");
    cy.clearLocalStorage();
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".theme-choice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="Zinzen Logo"]').click();
    cy.get(".dashboard-choice-light1").should("have.length", 1);
    cy.get(".dashboard-choice-light").should("have.length", 4);
  });

  it("Should have option to add Feelings", () => {
    cy.get(".add-icon").should("have.length", 1);
    cy.get(".add-icon").click().location("pathname")
      .should("include", "AddFeelings")
      .go("back");
  });
  it("Should have ZinZen button working", () => {
    cy.contains("ZinZen")
      .click()
      .location("pathname")
      .should("include", "ZinZen")
      .go("back");
  });

  it("Should have My Goals button working", () => {
    cy.contains("My Goals")
      .click()
      .location("pathname")
      .should("include", "MyGoals");
    cy.get('[alt="ZinZen Text Logo"]').click();
  });

  it("Should have My Time button", () => {
    cy.contains("My Time");
  });

  it("Should have Explore button working", () => {
    cy.contains("Explore")
      .click()
      .location("pathname")
      .should("include", "Explore")
      .go("back");
  });

  it("Should have My Feelings button working", () => {
    cy.contains("My Feelings")
      .click()
      .location("pathname")
      .should("include", "MyFeelings");
    cy.get('[alt="Zinzen Logo"]').click();
  });
});
