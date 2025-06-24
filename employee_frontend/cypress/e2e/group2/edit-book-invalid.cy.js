describe('Edit Book - Invalid Input', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Invalid Edit Book ${uniqueId}`;

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

  it('should add a new book to edit', () => {
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'This is a test book added by Cypress.'
    };
    
    cy.addBookReliably(bookData);
  });

  it('should show an error if the edited title is too long', () => {
    cy.navigateToGenre('Fantasy');
    
    // Click edit button for the specific book
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.edit-button').click();
      });
    
    // Wait for edit dialog and try to enter invalid data
    cy.waitForDialog();
    cy.get('.dialog').within(() => {
      const longTitle = 'A'.repeat(41);
      cy.get('input[type="text"]').eq(0).clear().type(longTitle);
      cy.get('button[type="submit"]').contains('Save Changes').click();
    });
    
    // Verify error message appears and dialog stays open
    cy.get('[data-cy=edit-book-error]').should('be.visible').and('contain', 'Title is too long');
    cy.get('.dialog').should('be.visible');
    cy.contains('.book-title', longTitle).should('not.exist');
  });
}); 