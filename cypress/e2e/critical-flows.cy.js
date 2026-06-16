describe('Kone Consult E2E', () => {
  it('Visits the Home Page', () => {
    cy.visit('/');
    cy.contains('Research. Analysis.');
    cy.contains('Explore Services').click();
    cy.url().should('include', '/services');
  });

  it('Navigates through navigation menu', () => {
    cy.visit('/');
    cy.get('.nav-link').contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('Our Mission');
  });

  it('Can toggle Light/Dark Mode', () => {
    cy.visit('/');
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    // We added an aria-label="Toggle Theme" to the button
    cy.get('button[aria-label="Toggle Theme"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('button[aria-label="Toggle Theme"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });
});
