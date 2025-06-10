describe('Add New Book - Invalid Input', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const bookTitle = `Cypress Invalid Book ${uniqueId}`;
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };

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
    cy.visit('/login');
    cy.get('[data-cy=username-input]').type(testUser.username);
    cy.get('[data-cy=password-input]').type(testUser.password);
    cy.get('[data-cy=login-button]').click();
    cy.contains('Welcome to LibraFlow!').should('be.visible');
  });

  it('should show an error if the title is too long', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    const longTitle = 'A'.repeat(41);
    cy.get('input').eq(0).type(longTitle); // Title
    cy.get('input').eq(1).type('Cypress Author'); // Author
    cy.get('input[type="number"]').type('2024'); // Year
    cy.get('select').select('Fantasy');
    cy.get('textarea').type('This is a test book with an invalid title.');
    cy.get('button[type="submit"]').contains('Add Book').click();
    cy.get('[data-cy=add-book-error]').should('be.visible').and('contain', 'Title is too long');
    cy.get('.dialog').should('be.visible');
    cy.contains('.book-title', longTitle).should('not.exist');
  });
}); 