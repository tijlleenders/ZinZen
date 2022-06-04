describe('DashboardUserChoice Test', () => {
  it('Should have 5 Choices to navigate My Goals/My Feelings/My Time/Explore/ZinZen', () => {
    cy.visit('/');
    cy.get('.lang-btn1').contains('English').click();
    cy.get('.theme-choice-btn').first().click();
    cy.get('.dashboard-choice-light1').should('have.length', 1);
    cy.get('.dashboard-choice-light').should('have.length', 4);
  });

  it('Should have option to add Goals and Feelings', () => {
    cy.get('.add-icon').should('have.length', 2);
    cy.get('.add-icon').eq(0).parent().prev()
      .contains(/My Goals|My Feelings/g);
    cy.get('.add-icon').eq(1).parent().prev()
      .contains(/My Goals|My Feelings/g);
  });

  it('Should have My Goals button', () => {
    cy.contains('My Goals').should('have.class', 'dashboard-choice-light1');
  });

  it('Should have My Feelings button', () => {
    cy.contains('My Feelings').should('have.class', 'dashboard-choice-light');
  });

  it('Should have My Time button', () => {
    cy.contains('My Time').should('have.class', 'dashboard-choice-light');
  });

  it('Should have Explore button', () => {
    cy.contains('Explore').should('have.class', 'dashboard-choice-light');
  });

  it('Should have ZinZen button', () => {
    cy.contains('ZinZen').should('have.class', 'dashboard-choice-light');
  });
});
