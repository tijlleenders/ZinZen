// implement playwright test

// describe("DashboardUserChoice Test", () => {
//   it("should have back button on the top-left in header", () => {
//     cy.visit("/");
//     cy.clearLocalStorage();
//     indexedDB.deleteDatabase("ZinZenDB");
//     cy.get(".lang-btn1").contains("English").click();
//     cy.get(".themeChoice-btn-light").first().click();
//     cy.contains("Skip Intro").click();
//     cy.get('[alt="ZinZen Text Logo"]').click();
//     cy.contains("My Goals").click();
//     cy.get('[alt="Back arrow"]');
//   });

//   it("should have add goal button on top-right in header", () => {
//     cy.get('[alt="save changes"]').parent().click();
//   });

//   it("should display options ( new, Hint ) for adding a new goal", () => {
//     cy.contains("New");
//     cy.contains("Hint");
//   });

//   it("Should display add goal field", () => {
//     cy.contains("New").click();
//     cy.get("#goalInputField");
//   });

//   it("should display all 8 types of tags after writing this goal", () => {
//     cy.get("#goalInputField").type("Testing this 1h daily start tomorrow after 12 due wednesday before 16 at www.google.com");
//     cy.get(".form-tag").contains("Start");
//     cy.get(".form-tag").contains("Daily");
//     cy.get(".form-tag").contains("Due");
//     cy.get(".form-tag").contains("Before");
//     cy.get(".form-tag").contains("After");
//     cy.get(".form-tag").contains("1h");
//     cy.get(".form-tag").contains("URL");
//     cy.get(".language");
//   });

//   it("should display tick button to add the goal", () => {
//     cy.get('[alt="save changes"]').parent().click();
//     cy.contains("Testing this URL");
//   });

//   it("should display the goal upon search", () => {
//     cy.get("#goal-searchBar").type("Testing this", { force: true });
//     cy.get(".goal-title").should("have.length", 1).contains("Testing this URL");
//   });

//   it("should display options when clicking on goal", () => {
//     cy.contains("Testing this URL").click();
//     cy.get(".interactables").children().should("have.length", 5);
//   });

//   it("should open share modal when click on share goal", () => {
//     cy.get('[alt="share goal"').click();
//     cy.get("#share-modal").should("be.visible");
//     cy.get(".modal").type("{esc}");
//     cy.get("#share-modal").should("not.exist");
//   });

//   it("should display sublist level with breadcrumb when we add subgoal", () => {
//     cy.contains("Testing this URL").click({ force: true });
//     cy.get('[alt="add subgoal"').click({ force: true });
//     cy.get(".sublist-title").should("have.text", "Testing this");
//     cy.get("li").should("have.attr", "class", "breadcrumb-item").should("have.length", 2).contains("Testing this");
//   });

//   it("should display options ( new, hint ) for adding a new sub goal", () => {
//     cy.contains("New");
//     cy.contains("Hint");
//   });

//   it("should be able to add sub goal", () => {
//     cy.contains("New").click();
//     cy.get("#goalInputField").type("subgoal");
//     cy.get('[alt="save changes"]').parent().click();
//     cy.contains("subgoal");
//   });

//   it("should take back to mygoals when clicked on back button in header", () => {
//     cy.get('[alt="Back arrow"]').click();
//     cy.get("#myGoals_title").contains("My Goals");
//     cy.get(".breadcrumb").should("not.exist");
//   });

//   it("should have edit goal btn working with dashed border", () => {
//     cy.contains(".user-goal", "Testing this URL").get(".goal-dd-outer").click({ force: true });
//     cy.get('[alt="Update Goal"]').click({ force: true });
//   });
//   it("should remove tag when clicked", () => {
//     cy.get(".form-tag").contains("Start");
//     cy.get(".form-tag").contains("Daily");
//     cy.get(".form-tag").contains("1h");
//     cy.get(".form-tag").contains("URL");
//     cy.get(".language");
//     cy.get(".form-tag").contains("Due").click({ force: true });
//   });
//   it("should be able to update goal", () => {
//     cy.get('[alt="save changes"]').parent().click();
//     cy.contains(".user-goal", "Testing this URL").get(".goal-dd-outer").click({ force: true });
//     cy.get('[alt="Update Goal"]').click({ force: true });
//     cy.get(".form-tag").should("not.have.text", "Due");
//   });

//   it("should archive goal when clicked on tick in goal drop-down options", () => {
//     cy.get('[alt="save changes"]').parent().click();
//     cy.contains(".user-goal", "Testing this URL").get(".goal-dd-outer").click({ force: true });
//     cy.get('[alt="archive Goal"]').click({ force: true });
//     cy.get(".goal-title").should("not.have", "Testing this URL");
//   });

//   it("should be able to add the goal from archive", () => {
//     cy.get('[alt="save changes"]').parent().click();
//     cy.contains("Archive").click();
//     cy.contains("Add from Archive");
//     cy.contains("Testing this");
//     cy.get('[alt="goal suggestion"]').parent().click();
//     cy.get(".modal-backdrop").click({ force: true });
//     cy.contains("Testing this URL");
//   });

//   it("should be able to delete the goal", () => {
//     cy.contains("Testing this").click({ force: true });
//     cy.get('[alt="delete goal"').click({ force: true });
//     cy.get(".goal-title").should("not.have", "Testing this URL");
//   });
// });
