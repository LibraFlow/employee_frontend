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
    cy.get('[data-cy=register-success]', { timeout: 10000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.loginAsLibrarian(testUser.username, testUser.password);
  });

  it('should add a new book to test cancel delete', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    cy.get('select').should('have.value', 'Fantasy');
    cy.get('.dialog input[type="text"]').eq(0).type(bookTitle);
    cy.get('.dialog input[type="text"]').eq(1).type('Cypress Author');
    cy.get('.dialog input[type="number"]').type('2024');
    cy.get('.dialog textarea').type('This is a test book added by Cypress.');
    cy.get('.dialog button[type="submit"]').contains('Add Book').click();
    cy.contains('.book-title', bookTitle).should('be.visible');
  });

  it('should show the custom modal and cancel deletion', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.delete-button')
      .click();
    cy.get('.modal').should('be.visible');
    cy.get('[data-cy=cancel-delete]').click();
    cy.get('.modal').should('not.exist');
    cy.contains('.book-title', bookTitle).should('be.visible');
  });
}); 