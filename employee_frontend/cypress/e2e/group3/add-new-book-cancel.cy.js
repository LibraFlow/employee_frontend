describe('Add New Book - Cancel', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Cancel ${uniqueId}`;

  before(() => {
    cy.visit('/register');
    cy.get('[data-cy=register-username]').type(testUser.username);
    cy.get('[data-cy=register-password]').type(testUser.password);
    cy.get('[data-cy=register-email]').type(testUser.email);
    cy.get('[data-cy=register-address]').type(testUser.address);
    cy.get('[data-cy=register-phone]').type(testUser.phone);
    cy.get('[data-cy=register-role]').select('Administrator');
    cy.get('[data-cy=register-role]').should('have.value', 'ADMINISTRATOR');
    cy.get('[data-cy=register-submit]').click();
    cy.contains('Terms and Policy').should('be.visible');
    cy.get('#policy-check').check({ force: true });
    cy.contains('button', 'Agree and Register').should('not.be.disabled').click();
    cy.get('[data-cy=register-success]', { timeout: 30000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.loginAsLibrarian(testUser.username, testUser.password);
  });

  it('should open the add book dialog and cancel', () => {
    cy.navigateToGenre('Fantasy');
    
    // Click Add Book button
    cy.contains('button', 'Add Book').click();
    cy.waitForDialog();
    
    // Fill form and cancel
    cy.get('.dialog').within(() => {
      cy.get('input[type="text"]').eq(0).type(bookTitle);
      cy.get('button[type="button"]').contains('Cancel').click();
    });
    
    // Verify dialog closed and book was not added
    cy.waitForElementToDisappear('.dialog');
    cy.contains('.book-title', bookTitle).should('not.exist');
  });
}); 