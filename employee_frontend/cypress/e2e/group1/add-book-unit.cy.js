describe('Add Book Unit', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Unit ${uniqueId}`;
  const unitData = {
    language: 'English',
    pageCount: '123',
    coverImageLink: 'https://example.com/cover.jpg',
    publisher: 'Cypress Publisher',
    isbn: '0-3545-7943-6',
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
    cy.contains('Terms and Policy').should('be.visible');
    cy.get('#policy-check').check({ force: true });
    cy.contains('button', 'Agree and Register').should('not.be.disabled').click();
    cy.get('[data-cy=register-success]', { timeout: 30000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=username-input]').type(testUser.username);
    cy.get('[data-cy=password-input]').type(testUser.password);
    cy.get('[data-cy=login-button]').click();
    cy.contains('Welcome to LibraFlow!', { timeout: 20000 }).should('be.visible');
  });

  it('should add a new book and a new book unit', () => {
    // Add a new book
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    
    // Use more specific selectors instead of .eq()
    cy.get('.dialog').within(() => {
      cy.get('input[type="text"]').first().type(bookTitle);
      cy.get('input[type="text"]').eq(1).type('Cypress Author');
      cy.get('input[type="number"]').type('2024');
      cy.get('textarea').type('Book for unit test.');
      cy.get('button[type="submit"]').contains('Add Book').click();
    });
    
    // Wait for dialog to close and book to appear
    cy.get('.dialog').should('not.exist');
    cy.contains('.book-title', bookTitle).should('be.visible');

    // Go to the book's units page - use more robust selector
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.units-button').click();
      });
    cy.contains('Book Units').should('be.visible');

    // Add a new book unit
    cy.contains('button', 'Add Unit').click();
    cy.contains('Add New Book Unit').should('be.visible');
    
    // Use more specific selectors for form inputs
    cy.get('.dialog').within(() => {
      cy.get('input').eq(0).type(unitData.language);
      cy.get('input').eq(1).type(unitData.pageCount);
      cy.get('input').eq(2).type(unitData.coverImageLink);
      cy.get('input').eq(3).type(unitData.publisher);
      cy.get('input').eq(4).type(unitData.isbn);
      cy.get('button[type="submit"]').contains('Add Unit').click();
    });

    // Wait for the dialog to close
    cy.get('.dialog').should('not.exist');

    // Now check for the new unit with explicit waits
    cy.get('.unit-card').should('exist');
    cy.get('.unit-card').should('contain.text', unitData.language);
    cy.get('.unit-card').should('contain.text', unitData.publisher);
    cy.get('.unit-card').should('contain.text', unitData.isbn);
  });
}); 