describe('Profile Delete Account', () => {
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
    cy.visit('/profile');
  });

  it('allows a user to delete their own account', () => {
    cy.contains('Delete My Account').should('be.visible').click();
    cy.contains('Are you sure you want to delete your account?').should('be.visible');
    cy.contains('Yes, Delete').should('be.visible').click();
    cy.url().should('include', '/login');
  });
}); 