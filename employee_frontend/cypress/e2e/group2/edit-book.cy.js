describe('Book Management - Edit Book', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Edit ${uniqueId}`;

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

  it('should navigate to the genres page', () => {
    cy.navigateToGenre('Fantasy');
    cy.contains('Browse by Genre').should('be.visible');
    cy.get('.genre-card').should('have.length.greaterThan', 0);
  });

  it('should open the Fantasy genre page', () => {
    cy.navigateToGenre('Fantasy');
    cy.contains('Fantasy Books').should('be.visible');
  });

  it('should add a new book to the Fantasy genre', () => {
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'This is a test book added by Cypress.'
    };
    
    cy.addBookReliably(bookData);
  });

  it('should edit the book description and verify the update', () => {
    cy.navigateToGenre('Fantasy');
    
    // Click edit button for the specific book
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.edit-button').click();
      });
    
    // Wait for edit dialog and update description
    cy.waitForDialog();
    cy.get('.dialog').within(() => {
      cy.get('textarea').clear().type('This is an updated description by Cypress.');
      cy.get('button[type="submit"]').contains('Save Changes').click();
    });
    
    // Wait for dialog to close
    cy.waitForElementToDisappear('.dialog');
    
    // Reload and verify the update
    cy.reload();
    cy.navigateToGenre('Fantasy');
    
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.book-description').should('contain', 'This is an updated description by Cypress.');
      });
  });
}); 