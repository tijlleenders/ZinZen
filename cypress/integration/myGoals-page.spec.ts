describe("DashboardUserChoice Test", () => {
  it("should have back button on the top-left in header", () => {
    cy.visit("/");
    cy.clearLocalStorage();
    indexedDB.deleteDatabase("ZinZenDB");
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn-light").first().click();
    cy.contains("Skip Intro").click();
  });

  it("should have add goal button on top-right in header", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
  });

  it("should display options ( new, hint ) for adding a new goal", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New");
    cy.contains("Hint");
  });

  it("Should display add goal field", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this");
  });

  it("should display all 8 types of tags after writing this goal", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get(".form-tag").contains("Start");
    cy.get(".form-tag").contains("Daily");
    cy.get(".form-tag").contains("Due");
    cy.get(".form-tag").contains("Before");
    cy.get(".form-tag").contains("After");
    cy.get(".form-tag").contains("1 hours");
    cy.get(".form-tag").contains("URL");
    cy.get(".language");
    cy.contains("Testing this").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should display tick button to add the goal", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New")
  });

  it("should display the goal upon search", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.get("#goal-searchBar").type("Testing this");
    cy.get(".goal-title div").should("have.length", 1).contains("Testing this");
    cy.contains("Testing this").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should display sublist level with breadcrumb when we add subgoal", () => {
    cy.visit("/MyGoals");
    cy.get('.goal-dropdown').first().click();
    cy.get('[alt="add subgoal"]').click();
    cy.get("li").should("have.attr", "class", "breadcrumb-item").should("have.length", 2)
  });

  it("should be able to add sub goal", () => {
    cy.visit("/MyGoals");
    cy.get('.goal-dropdown').first().click();
    cy.get('[alt="add subgoal"]').click();
    cy.get('.addGoal-option').first().click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should take back to mygoals when clicked on back button in header", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="Back arrow"]').click();
    cy.get("#myGoals_title").contains("My Goals");
    cy.get(".breadcrumb").should("not.exist");
  });

  it("should have edit goal btn working with dashed border", () => {
    cy.visit("/MyGoals");
    cy.get('.goal-dropdown').first().click();
    cy.get('[alt="Update Goal"]').click();
    cy.get("#updateGoalForm #goalInputField").invoke("css", "border").should("include", "2.5px dashed");
  });


  it("should remove tag when clicked", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get(".tags button").click({ multiple: true });
    cy.get(".language");
  });

  it("should be able to update goal", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this").click();
    cy.get('[alt="Update Goal"]').click();
    cy.get("#goalInputField").clear().type("Testing this updated 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this updated").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should archive goal when clicked on tick in goal drop-down options", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this").click();
    cy.get('[alt="archive Goal"]').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should be able to add the goal from archive", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this").click();
    cy.get('[alt="archive Goal"]').click();
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Archive").click();
    cy.contains("Add from Archive");
    cy.contains('Testing this').next().click();
    cy.get(".modal-backdrop").click({ force: true });
    cy.contains("Testing this URL").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });

  it("should be able to delete the goal", () => {
    cy.visit("/MyGoals");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("New").click();
    cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
    cy.get('[alt="save changes"]').parent().click();
    cy.contains("Testing this").click();
    cy.get('[alt="delete goal"').click();
    cy.get(".goal-title").should("not.have", "Testing this URL");
  });
});
