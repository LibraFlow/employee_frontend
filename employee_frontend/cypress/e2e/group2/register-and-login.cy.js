describe('User Registration and Login', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };

  it('should register a new account as Administrator', () => {
    cy.visit('/register');
    cy.get('[data-cy=register-username]').should('be.visible').type(testUser.username);
    cy.get('[data-cy=register-password]').should('be.visible').type(testUser.password);
    cy.get('[data-cy=register-email]').should('be.visible').type(testUser.email);
    cy.get('[data-cy=register-address]').should('be.visible').type(testUser.address);
    cy.get('[data-cy=register-phone]').should('be.visible').type(testUser.phone);
    cy.get('[data-cy=register-role]').should('be.visible').select('Administrator');
    cy.get('[data-cy=register-role]').should('have.value', 'ADMINISTRATOR');
    cy.get('[data-cy=register-submit]').should('be.visible').click();
    cy.contains('Terms and Policy').should('be.visible');
    cy.get('#policy-check').should('be.visible').check({ force: true });
    cy.contains('button', 'Agree and Register').should('not.be.disabled').click();
    cy.get('[data-cy=register-success]', { timeout: 30000 }).should('be.visible');
  });

  it('should log in with the new account', () => {
    cy.visit('/login');
    cy.get('[data-cy=username-input]').should('be.visible').type(testUser.username);
    cy.get('[data-cy=password-input]').should('be.visible').type(testUser.password);
    cy.get('[data-cy=login-button]').should('be.visible').click();
    cy.contains('Welcome to LibraFlow!', { timeout: 20000 }).should('be.visible');
  });
}); 