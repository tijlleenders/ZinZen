describe('DashboardUserChoice Test', () => {
  it('Should have Health and Fitness Goals Card', () => {
    cy.visit('/');
    cy.get('.lang-btn1').contains('English').click();
    cy.get('.theme-choice-btn').first().click();
    cy.contains('I already know ZinZen').click();
    cy.contains('Explore').click();

    cy.contains('Health and Fitness Goals');
  });

  it('Should have Relationship Goals Card', () => {
    cy.contains('Relationship Goals');
  });

  it('Should have Personal Growth and Learning Goals Card', () => {
    cy.contains('Personal Growth and Learning Goals');
  });

  it('Should have Nature and Environment Goals Card', () => {
    cy.contains('Nature and Environment Goals');
  });

  it('Should have Career Goals Card', () => {
    cy.contains('Career Goals');
  });

  it('Should have Mind and Spirit Goals Card', () => {
    cy.contains('Mind and Spirit Goals');
  });
});
