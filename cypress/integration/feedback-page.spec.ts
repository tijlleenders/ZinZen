describe("FeedbackPage Tests", () => {
  it('1st line should be "We value your opinion."', () => {
    cy.visit("/");
    cy.clearLocalStorage();
    cy.get(".lang-btn1").contains("English").click();
    cy.get(".themeChoice-btn").first().click();
    cy.contains("Skip Intro").click();
    cy.get('[alt="ZinZen Text Logo"]').click();
    cy.contains("ZinZen").click();
    cy.contains("Feedback").click();
    cy.contains("We value your opinion.");
  });

  it('2nd line should be "Please rate your experience"', () => {
    cy.contains("We value your opinion.").next().should("contain.text", "Please rate your experience");
  });

  it("5 Stars should be available for rating", () => {
    cy.get(".star").should("have.length", 5);
  });

  it("default rating should be 5 star", () => {
    cy.get(".decided").should("have.length", 5);
  });

  it("'How can we make your experience better?' question should be there", () => {
    cy.contains("How can we make your experience better?");
  });

  it("feedback textbox should have a placeholder", () => {
    cy.get("#feedback-textbox").should("have.attr", "placeholder", "Type your feedback here...");
  });

  it("should have a feedback submit btn", () => {
    cy.get("Button").contains("submit");
  });

  it("feedback is anonymous statement should come above to submit btn", () => {
    cy.contains("Your feedback is anonymous. If you want a reply, please leave an email or a phone number.")
      .next()
      .contains("submit");
  });
});
