describe("ZinZen-page Test", () => {
    it("Should have btn that redirects to github repo", () => {
        cy.visit("/");
        cy.get(".lang-btn1").contains("English").click();
        cy.get(".theme-choice-btn").first().click();
        cy.contains("I already know ZinZen").click();
        cy.contains("ZinZen").click();
        cy.contains("Browse the code").parent().should("have.attr", "href", "https://github.com/tijlleenders/ZinZen");
    });
    it("Should have donate btn", () => {
        cy.contains("Donate")
            .parent()
            .should("have.attr", "href", "https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate");
    });
    it("Should have Feedback btn that redirects to feedback page", () => {
        cy.contains("Feedback").parent().click().location("pathname").should("include", "Feedback").go("back");
    });
    it("Should have Blog btn that redirects to blog page", () => {
        cy.contains("Blog").parent().should("have.attr", "href", "https://blog.zinzen.me/");
    });
});
