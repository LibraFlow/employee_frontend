describe('Profile Cancel Export', () => {
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

  it('allows a user to cancel exporting their personal data', () => {
    cy.contains('Export My Data').click();
    cy.contains('Do you want to export your data?').should('be.visible');
    cy.contains('Cancel').click();
    cy.contains('Do you want to export your data?').should('not.exist');
  });
}); 