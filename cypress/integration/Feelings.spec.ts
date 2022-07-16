describe("Desktop Mode Tests", () => {
  it("should have 6 categories of feelings on addFeelings Page", () => {
    cy.visit("/");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".theme-choice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="Zinzen Logo"]').click();
    cy.get(".add-icon").eq(1).click();
    cy.contains("Happy");
    cy.contains("Excited");
    cy.contains("Gratitude");
    cy.contains("Sad");
    cy.contains("Afraid");
    cy.contains("Angry");
  });
  it("should be able to add feeling (Joyful)", () => {
    cy.get(".feelings-menu-desktop").get("Button").contains("Joyful").click({ force: true });
  });
  it("Joyful feeling should be added at MyFeelings Page", () => {
    cy.location("pathname").should("include", "MyFeelings");
    cy.contains("Joyful");
  });
  it("'View My Feelings' button should be working", () => {
    cy.visit("/Home/AddFeelings");
    cy.contains("View My Feelings").click({ force: true });
    cy.location("pathname").should("include", "MyFeelings");
  });
  it("Should display dropdown below the selected feeling onClick", () => {
    cy.get(".btn-my-feelings__text").contains("Joyful").eq(0).parent()
      .parent()
      .click();
    cy.get(".show-feelings__options");
  });
  it("Should display popup modal when clicked on notebook", () => {
    cy.get(".show-feelings__options > svg").eq(1).click();
    cy.contains("Want to tell more about it?");
    cy.get(".show-feelings__note-input");
    cy.get(".show-feelings__modal-button");
  });
  it("Should Display note on MyFeelings page", () => {
    cy.get(".show-feelings__note-input").type("This is test note");
    cy.contains("Done").click({ force: true });
    cy.get(".btn-my-feelings__note").should("have.text", "This is test note");
  });

  it("Should be able to Delete note on MyFeelings page", () => {
    cy.get(".show-feelings__options > svg").eq(1).click();
    cy.contains("Delete").click({ force: true });
    cy.contains("This is test note").should("not.exist");
  });

  it("Should be able to Delete Feeling", () => {
    cy.get(".show-feelings__options > svg").eq(0).click();
    cy.contains("Joyful").should("not.exist");
  });
});
