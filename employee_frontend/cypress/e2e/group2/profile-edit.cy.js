describe('Profile Edit', () => {
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

  it('allows a user to edit their profile settings', () => {
    cy.contains('Edit Profile').click();
    cy.get('input[name="username"]').clear().type('updateduser');
    cy.get('input[name="email"]').clear().type('updateduser@gmail.com');
    cy.get('input[name="pwd"]').clear().type('NewPass123!');
    cy.get('input[name="address"]').clear().type('456 Updated Ave');
    cy.get('input[name="phone"]').clear().type('9876543210');
    cy.contains('Save').click();
    cy.contains('Profile updated successfully.').should('be.visible');
    cy.get('input[name="username"]').should('have.value', 'updateduser');
    cy.get('input[name="email"]').should('have.value', 'updateduser@gmail.com');
    cy.get('input[name="address"]').should('have.value', '456 Updated Ave');
    cy.get('input[name="phone"]').should('have.value', '9876543210');
    cy.get('input[name="pwd"]').should('have.value', '********');
  });
}); 