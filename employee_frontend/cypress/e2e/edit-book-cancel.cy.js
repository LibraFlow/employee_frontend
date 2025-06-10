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
    cy.get('[data-cy=register-success]', { timeout: 10000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.loginAsLibrarian(testUser.username, testUser.password);
  });

  it('should add a new book for editing', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    cy.get('.dialog input[type="text"]').eq(0).type(bookTitle);
    cy.get('.dialog input[type="text"]').eq(1).type('Cypress Author');
    cy.get('.dialog input[type="number"]').type('2024');
    cy.get('.dialog textarea').type(originalDescription);
    cy.get('.dialog button[type="submit"]').contains('Add Book').click();
    cy.contains('.book-title', bookTitle).should('be.visible');
    cy.contains('.book-description', originalDescription).should('be.visible');
  });

  it('should open the edit dialog and cancel', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.edit-button')
      .click();
    cy.contains('Edit Book').should('be.visible');
    cy.get('.dialog textarea').clear().type(newDescription);
    cy.get('.dialog button[type="button"]').contains('Cancel').click();
    cy.contains('Edit Book').should('not.exist');
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.book-description')
      .should('contain', originalDescription)
      .and('not.contain', newDescription);
  });
}); 