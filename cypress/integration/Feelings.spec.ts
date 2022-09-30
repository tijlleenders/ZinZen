describe("Desktop Mode Tests", () => {
  it("should be able to add feeling (Joyful)", () => {
    indexedDB.deleteDatabase("ZinZenDB");
    cy.visit("/");
    cy.clearLocalStorage();
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".theme-choice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="Zinzen Logo"]').click();
    cy.contains("My Feelings").click();
    cy.get('[alt="add-feeling"]').click();
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
    cy.get(".btn-my-feelings__note").contains("This is test note");
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

describe("Mobile Mode Tests", () => {
  it("Should display popup modal when clicked on expand icon of a feeling", () => {
    cy.visit("/");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".theme-choice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="Zinzen Logo"]').click();
    cy.contains("My Feelings").click();
    cy.viewport("iphone-6");
    cy.get('[alt="add-feeling"]').click();
    cy.get(".feelings-expand-btw-light").eq(0).click();
  });
  it("Should have input field for custom feeling", () => {
    cy.get("#myfeelings-custom-feeling-input").should("exist");
  });
  it("Should have feelings to choose from", () => {
    cy.get(".feelingOption-name").should("have.length.at.least", 1);
  });
  it("Should have add note input field", () => {
    cy.get("#myfeelings-note-input").should("exist");
  });
  it("should be able to add feeling (Loved) with note", () => {
    cy.get(".feelingOption-name").contains("Loved").click({ force: true });
    cy.get("#myfeelings-note-input").type("This is mobile test note");
    cy.contains("Done").click();
  });
  it("should show the added feeling and ellipsis on MyFeelings Page", () => {
    cy.viewport("iphone-6");
    cy.contains("Loved");
    cy.contains("...");
  });
});
