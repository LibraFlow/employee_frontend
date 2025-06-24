describe('Book Management - Delete Book', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = 'Cypress Test Book For Deletion';

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

  it('should delete the new book and verify it is removed', () => {
    cy.navigateToGenre('Fantasy');
    
    // Use more robust selector for finding and clicking delete button
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.delete-button').click();
      });
    
    // Wait for confirmation dialog and click delete
    cy.contains('button', 'Delete').should('be.visible').click();
    
    // Wait for the book to be removed
    cy.contains('.book-title', bookTitle).should('not.exist');
  });
}); 