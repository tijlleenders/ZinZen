describe("DashboardUserChoice Test", () => {
  it("should have back button on the top-left in header", () => {
    cy.visit("/");
    cy.clearLocalStorage();
    indexedDB.deleteDatabase("ZinZenDB");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="ZinZen Text Logo"]').click();
    cy.contains("My Goals").click();
    cy.get('[alt="Back arrow"]');
    // cy.get("#goal-searchBar");
  });

  it("should have add goal button on top-right in header", () => {
    cy.get('[alt="save changes"]').parent().click();
  });

  it("should display options ( new, public, archive ) for adding a new goal", () => {
    cy.contains("New");
    cy.contains("Public");
    cy.contains("Archive");
  });

  it("Should display add goal field", () => {
    cy.contains("New").click();
    cy.get("#goalInputField");
  });

  it("should display all 8 types of tags after writing this goal", () => {
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get(".form-tag").contains("Start");
    cy.get(".form-tag").contains("Daily");
    cy.get(".form-tag").contains("Due");
    cy.get(".form-tag").contains("Before");
    cy.get(".form-tag").contains("After");
    cy.get(".form-tag").contains("1 hours");
    cy.get(".form-tag").contains("URL");
    cy.get(".language");
  });

  it("should display tick button to add the goal", () => {
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this URL");
  });

  it("should display the goal upon search", () => {
    cy.get("#goal-searchBar").type("Testing this");
    cy.get(".goal-title").should("have.length", 1).contains("Testing this URL");
  });

  it("should display options when clicking on goal", () => {
    cy.contains("Testing this URL").click();
    cy.get(".interactables").children().should("have.length", 5);
  });

  it("should open share modal when click on share goal", () => {
    cy.get('[alt="share goal"').click();
    cy.get("#share-modal").should("be.visible");
    cy.get(".modal").click();
    cy.get("#share-modal").should("not.exist");
  });

  it("should display sublist level with breadcrumb when we add subgoal", () => {
    cy.contains("Testing this URL").click();
    cy.get('[alt="add subgoal"').click();
    cy.get(".sublist-title").should("have.text", "Testing this");
    cy.get("li").should("have.attr", "class", "breadcrumb-item").should("have.length", 2).contains("Testing this");
  });

  it("should be able to add sub goal", () => {
    cy.get("#goalInputField").type("subgoal");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("subgoal");
  });

  it("should take back to mygoals when clicked on back button in header", () => {
    cy.get('[alt="Back arrow"]').click();
    cy.get("#myGoals_title").contains("My Goals");
    cy.get(".breadcrumb").should("not.exist");
  });

  it("should have edit goal btn working with dashed border", () => {
    cy.get(".goal-dropdown").eq(0).click();
    cy.get('[alt="Update Goal"]').click();
    cy.get("#updateGoalForm #goalInputField").invoke("css", "border").should("include", "2.5px dashed");
  });
  it("should remove tag when clicked", () => {
    cy.get(".form-tag").contains("Start");
    cy.get(".form-tag").contains("Daily");
    cy.get(".form-tag").contains("Before");
    cy.get(".form-tag").contains("After");
    cy.get(".form-tag").contains("1 hours");
    cy.get(".form-tag").contains("URL");
    cy.get(".language");
    cy.get(".form-tag").contains("Due").click();
  });
  it("should be able to update goal", () => {
    cy.get('[alt="save changes"]').parent().click();
    cy.get(".goal-dropdown").eq(0).click();
    cy.get('[alt="Update Goal"]').click();
    cy.get(".form-tag").should("not.have.text", "Due");
  });

  it("should archive goal when clicked on tick in goal drop-down options", () => {
    cy.get('[alt="save changes"]').parent().click();
    cy.get(".goal-dropdown").eq(0).click();
    cy.get('[alt="archive Goal"]').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should be able to add the goal from archive", () => {
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Archive").click();
    cy.contains("Add from Archive");
    cy.contains("Testing this");
    cy.get('[alt="goal suggestion"]').parent().click();
    cy.get(".modal-backdrop").click({ force: true });

    cy.contains("Testing this URL");
  });

  it("should be able to delete the goal", () => {
    cy.contains("Testing this").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });
});
