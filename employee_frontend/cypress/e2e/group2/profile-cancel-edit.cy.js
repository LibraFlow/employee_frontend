describe('Profile Cancel Edit', () => {
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

  it('allows a user to cancel editing their profile settings', () => {
    cy.contains('Edit Profile').should('be.visible').click();
    
    // Wait for form to be ready and fill in temporary values
    cy.get('input[name="username"]').should('be.visible').clear().type('shouldnotpersist');
    cy.get('input[name="email"]').should('be.visible').clear().type('shouldnotpersist@gmail.com');
    cy.get('input[name="pwd"]').should('be.visible').clear().type('ShouldNotPersist123!');
    cy.get('input[name="address"]').should('be.visible').clear().type('Should Not Persist');
    cy.get('input[name="phone"]').should('be.visible').clear().type('0000000000');
    
    cy.contains('Cancel').should('be.visible').click();
    
    // Verify original values are preserved
    cy.get('input[name="username"]').should('have.value', testUser.username);
    cy.get('input[name="email"]').should('have.value', testUser.email);
    cy.get('input[name="address"]').should('have.value', testUser.address);
    cy.get('input[name="phone"]').should('have.value', testUser.phone);
    cy.get('input[name="pwd"]').should('have.value', '********');
  });
}); 