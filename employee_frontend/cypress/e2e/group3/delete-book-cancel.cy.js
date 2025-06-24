describe('Book Management - Delete Book Cancel', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = 'Cypress Test Book For Delete Cancel';

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

  it('should add a new book to test cancel delete', () => {
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'This is a test book added by Cypress.'
    };
    
    cy.addBookReliably(bookData);
  });

  it('should show the custom modal and cancel deletion', () => {
    cy.navigateToGenre('Fantasy');
    
    // Click delete button for the specific book
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.delete-button').click();
      });
    
    // Verify modal appears and cancel deletion
    cy.get('.modal').should('be.visible');
    cy.get('[data-cy=cancel-delete]').click();
    
    // Verify modal closes and book still exists
    cy.waitForElementToDisappear('.modal');
    cy.contains('.book-title', bookTitle).should('be.visible');
  });
}); 