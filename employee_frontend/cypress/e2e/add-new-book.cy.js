describe('Adding Book', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `librarian${uniqueId}`,
    password: 'password123!',
    email: `librarian${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Add ${uniqueId}`;

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

  it('should show the home page after login', () => {
    cy.contains('Welcome to LibraFlow!').should('be.visible');
  });

  it('should allow navigation to genres page and see genre cards', () => {
    cy.contains('Genres').click();
    cy.url().should('include', '/genres');
    cy.contains('Browse by Genre').should('be.visible');
    cy.get('.genre-card').should('have.length.greaterThan', 0);
  });

  it('should add a new book to the Fantasy genre and display it in the list', () => {
    // Go to genres page via navbar
    cy.contains('Genres').click();
    cy.url().should('include', '/genres');
    cy.contains('Browse by Genre').should('be.visible');

    // Click the Fantasy genre card
    cy.contains('.genre-card', 'Fantasy').click();
    cy.url().should('include', '/genres/Fantasy');
    cy.contains('Fantasy Books').should('be.visible');

    // Click the Add Book button
    cy.contains('button', 'Add Book').click();

    // The add book popup/modal should appear
    cy.contains('Add New Book').should('be.visible');
    cy.get('select').should('have.value', 'Fantasy');
    cy.get('.dialog input[type="text"]').eq(0).type(bookTitle); // Title
    cy.get('.dialog input[type="text"]').eq(1).type('Cypress Author'); // Author
    cy.get('.dialog input[type="number"]').type('2024'); // Year
    cy.get('.dialog textarea').type('This is a test book added by Cypress.'); // Description

    // Submit the form
    cy.get('.dialog button[type="submit"]').contains('Add Book').click();

    // Verify the new book appears in the list
    cy.contains('.book-title', bookTitle).should('be.visible');
    cy.contains('.book-author', 'Cypress Author').should('be.visible');
    cy.contains('.book-year', '2024').should('be.visible');
    cy.contains('.book-description', 'This is a test book added by Cypress.').should('be.visible');
  });

  // Skipping add/update/delete book tests as the UI does not expose data-cy selectors or direct book CRUD UI in the current code
}); 