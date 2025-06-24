// Custom command for librarian login
Cypress.Commands.add('loginAsLibrarian', (username, password) => {
  cy.visit('/login');
  cy.get('[data-cy=username-input]').type(username);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('match', /localhost:3001\/?$/);
});

// Custom command for adding a new book
Cypress.Commands.add('addNewBook', (bookData) => {
  cy.get('[data-cy=add-book-button]').click();
  cy.get('[data-cy=book-title-input]').type(bookData.title);
  cy.get('[data-cy=book-author-input]').type(bookData.author);
  cy.get('[data-cy=book-genre-select]').select(bookData.genre);
  cy.get('[data-cy=book-description-input]').type(bookData.description);
  cy.get('[data-cy=submit-book-button]').click();
});

// Custom command for updating a book
Cypress.Commands.add('updateBook', (bookId, updatedData) => {
  cy.get(`[data-cy=edit-book-${bookId}]`).click();
  cy.get('[data-cy=book-title-input]').clear().type(updatedData.title);
  cy.get('[data-cy=book-author-input]').clear().type(updatedData.author);
  cy.get('[data-cy=book-genre-select]').select(updatedData.genre);
  cy.get('[data-cy=book-description-input]').clear().type(updatedData.description);
  cy.get('[data-cy=submit-book-button]').click();
});

// Custom command for deleting a book
Cypress.Commands.add('deleteBook', (bookId) => {
  cy.get(`[data-cy=delete-book-${bookId}]`).click();
  cy.get('[data-cy=confirm-delete-button]').click();
});

// Custom command for changing book availability
Cypress.Commands.add('changeBookAvailability', (bookId, available) => {
  cy.get(`[data-cy=availability-toggle-${bookId}]`).click();
  if (available) {
    cy.get('[data-cy=confirm-availability-button]').click();
  }
});

// Custom command for registering a new librarian user
Cypress.Commands.add('registerLibrarian', (user) => {
  cy.visit('/register');
  cy.get('[data-cy=register-username]').type(user.username);
  cy.get('[data-cy=register-password]').type(user.password);
  cy.get('[data-cy=register-email]').type(user.email);
  cy.get('[data-cy=register-address]').type(user.address);
  cy.get('[data-cy=register-phone]').type(user.phone);
  cy.get('[data-cy=register-submit]').click();
  cy.contains('Terms and Policy').should('be.visible');
  cy.get('#policy-check').check({ force: true });
  cy.contains('button', 'Agree and Register').should('not.be.disabled').click();
  cy.get('[data-cy=register-success]', { timeout: 30000 }).should('be.visible');
}); 

// Anti-flaky commands

// Wait for dialog to be fully ready before interacting
Cypress.Commands.add('waitForDialog', () => {
  cy.get('.dialog').should('be.visible');
  cy.get('.dialog').should('not.be.disabled');
});

// Fill form fields with better error handling
Cypress.Commands.add('fillFormField', (selector, value, options = {}) => {
  cy.get(selector, { timeout: options.timeout || 30000 })
    .should('be.visible')
    .should('not.be.disabled')
    .clear({ force: true })
    .type(value, { force: true });
});

// Click button with retry logic
Cypress.Commands.add('clickButton', (selector, options = {}) => {
  cy.get(selector, { timeout: options.timeout || 30000 })
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true });
});

// Wait for element to disappear with timeout
Cypress.Commands.add('waitForElementToDisappear', (selector, timeout = 30000) => {
  cy.get(selector, { timeout }).should('not.exist');
});

// Navigate to genre with retry
Cypress.Commands.add('navigateToGenre', (genreName) => {
  cy.contains('Genres').click();
  cy.contains('.genre-card', genreName).click();
  cy.url().should('include', `/genres/${genreName}`);
});

// Add book with reliable form filling
Cypress.Commands.add('addBookReliably', (bookData) => {
  cy.contains('button', 'Add Book').click();
  cy.waitForDialog();
  
  cy.get('.dialog').within(() => {
    cy.fillFormField('input[type="text"]:first', bookData.title);
    cy.fillFormField('input[type="text"]:nth-child(2)', bookData.author);
    cy.fillFormField('input[type="number"]', bookData.year);
    cy.fillFormField('textarea', bookData.description);
    cy.clickButton('button[type="submit"]');
  });
  
  cy.waitForElementToDisappear('.dialog');
  cy.contains('.book-title', bookData.title).should('be.visible');
}); 