describe('Edit Book - Cancel', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = 'Cypress Book For Edit Cancel';
  const originalDescription = 'Original description for cancel test.';
  const newDescription = 'This should not be saved.';

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

  it('should add a new book for editing', () => {
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: originalDescription
    };
    
    cy.addBookReliably(bookData);
    cy.contains('.book-description', originalDescription).should('be.visible');
  });

  it('should open the edit dialog and cancel', () => {
    cy.navigateToGenre('Fantasy');
    
    // Click edit button for the specific book
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.edit-button').click();
      });
    
    // Wait for edit dialog and make changes
    cy.waitForDialog();
    cy.get('.dialog').within(() => {
      cy.get('textarea').clear().type(newDescription);
      cy.get('button[type="button"]').contains('Cancel').click();
    });
    
    // Wait for dialog to close
    cy.waitForElementToDisappear('.dialog');
    
    // Verify the description was not changed
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.book-description')
          .should('contain', originalDescription)
          .and('not.contain', newDescription);
      });
  });
}); 