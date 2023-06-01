describe("Onboarding", () => {
  it("should select a language and navigate to the FAQ page", () => {
    cy.visit("/");
    cy.get(".containerLang button").first().click();
    cy.url().should("include", "/ZinZenFAQ");
    cy.get(".ant-collapse-item").should("have.length", 4);
  });

  it("should navigate to the homepage after clicking continue button on the FAQ page", () => {
    cy.get("button").click();
    cy.url().should("equal", `${Cypress.config().baseUrl}/`);
  });
});

export const completeOnboarding = () => {
  localStorage.setItem("checkedIn", "yes");
  localStorage.setItem("language", "en");
  localStorage.setItem("i18nextLng", "en");
  localStorage.setItem("darkMode", "off");
  localStorage.setItem("theme", JSON.stringify({ light: 1, dark: 1 }));
};
