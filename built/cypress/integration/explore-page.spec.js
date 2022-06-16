describe("ExplorePage Test", () => {
    it("Explore page should have Backgorund color rgb(240, 230, 225)", () => {
        cy.visit("/");
        cy.get(".lang-btn1").contains("English").click();
        cy.get(".theme-choice-btn").first().click();
        cy.contains("I already know ZinZen").click();
        cy.contains("Explore").click();
        cy.get("#explore-container-light").invoke("css", "background-color").should("equal", "rgb(240, 230, 225)");
    });
    it("Goal Card Should have Backgorund color rgb(237, 199, 183)", () => {
        cy.get(".goal-row").invoke("css", "background-color").should("equal", "rgb(237, 199, 183)");
    });
    it("Font color of Goal Title should be black", () => {
        cy.get(".goal-title").invoke("css", "color").should("equal", "rgb(0, 0, 0)");
    });
    it("Should have Goal title in center of card", () => {
        cy.get(".goal-title").invoke("css", "text-align").should("equal", "center");
    });
    it("Should have Health and Fitness Goals Card", () => {
        cy.contains("Health and Fitness Goals");
    });
    it("Should have Relationship Goals Card", () => {
        cy.contains("Relationship Goals");
    });
    it("Should have Personal Growth and Learning Goals Card", () => {
        cy.contains("Personal Growth and Learning Goals");
    });
    it("Should have Nature and Environment Goals Card", () => {
        cy.contains("Nature and Environment Goals");
    });
    it("Should have Career Goals Card", () => {
        cy.contains("Career Goals");
    });
    it("Should have Mind and Spirit Goals Card", () => {
        cy.contains("Mind and Spirit Goals");
    });
    it("Add Goal btn should be there", () => {
        cy.get(".addGoal-btn").should("have.length", 6);
    });
    it("Display Goal Images in their respective cards", () => {
        cy.get(".goal-img").should("have.length", 6).should("be.visible");
    });
});
