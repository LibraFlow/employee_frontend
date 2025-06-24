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
    cy.contains('Terms and Policy').should('be.visible');
    cy.get('#policy-check').check({ force: true });
    cy.contains('button', 'Agree and Register').should('not.be.disabled').click();
    cy.get('[data-cy=register-success]', { timeout: 30000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.loginAsLibrarian(testUser.username, testUser.password);
  });

  it('should show the home page after login', () => {
    cy.contains('Welcome to LibraFlow!', { timeout: 20000 }).should('be.visible');
  });

  it('should allow navigation to genres page and see genre cards', () => {
    cy.navigateToGenre('Fantasy');
    cy.contains('Browse by Genre').should('be.visible');
    cy.get('.genre-card').should('have.length.greaterThan', 0);
  });

  it('should add a new book to the Fantasy genre and display it in the list', () => {
    cy.navigateToGenre('Fantasy');
    cy.contains('Fantasy Books').should('be.visible');

    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'This is a test book added by Cypress.'
    };
    
    cy.addBookReliably(bookData);
    
    // Verify the new book appears in the list
    cy.contains('.book-author', 'Cypress Author').should('be.visible');
    cy.contains('.book-year', '2024').should('be.visible');
    cy.contains('.book-description', 'This is a test book added by Cypress.').should('be.visible');
  });

  // Skipping add/update/delete book tests as the UI does not expose data-cy selectors or direct book CRUD UI in the current code
}); 