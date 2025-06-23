describe('Overdue & Unavailable Book Units Page', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 1000)}`,
    password: 'TestPass123!',
    email: `testuser${Math.floor(Math.random() * 1000)}@gmail.com`,
    address: '123 Test Street',
    phone: '12345678901',
  };

  beforeEach(() => {
    cy.registerLibrarian(testUser);
    cy.loginAsLibrarian(testUser.username, testUser.password);
  });

  it('should allow the user to reach the Overdue & Unavailable Book Units page', () => {
    cy.visit('/overdue-unavailable-units');
    cy.contains('h1', 'Overdue & Unavailable Book Units').should('be.visible');
  });
}); 