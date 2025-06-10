describe('Add Book Unit - Invalid Input', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Invalid Unit ${uniqueId}`;
  const validUnitData = {
    language: 'English',
    pageCount: '123',
    coverImageLink: 'https://example.com/cover.jpg',
    publisher: 'Cypress Publisher',
    isbn: '123456789X',
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

  it('should show an error for invalid cover image link', () => {
    // Add a new book
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    cy.get('.dialog input[type="text"]').eq(0).type(bookTitle);
    cy.get('.dialog input[type="text"]').eq(1).type('Cypress Author');
    cy.get('.dialog input[type="number"]').type('2024');
    cy.get('.dialog textarea').type('Book for invalid unit test.');
    cy.get('.dialog button[type="submit"]').contains('Add Book').click();
    cy.contains('.book-title', bookTitle).should('be.visible');

    // Go to the book's units page
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.units-button')
      .click();
    cy.contains('Book Units').should('be.visible');

    // Try to add a new book unit with an invalid image link
    cy.contains('button', 'Add Unit').click();
    cy.contains('Add New Book Unit').should('be.visible');
    cy.get('.dialog input').eq(0).type(validUnitData.language);
    cy.get('.dialog input').eq(1).type(validUnitData.pageCount);
    cy.get('.dialog input').eq(2).type('not-a-url.txt');
    cy.get('.dialog input').eq(3).type(validUnitData.publisher);
    cy.get('.dialog input').eq(4).type(validUnitData.isbn);
    cy.get('.dialog button[type="submit"]').contains('Add Unit').click();
    cy.get('.dialog').should('be.visible');
    cy.get('.dialog input').eq(2).then($input => {
      expect($input[0].checkValidity()).to.be.false;
    });
    cy.contains('.unit-card', validUnitData.language).should('not.exist');
  });

  it('should show an error for invalid ISBN', () => {
    // Go to the book's units page (book already created in previous test)
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.units-button')
      .click();
    cy.contains('Book Units').should('be.visible');

    // Try to add a new book unit with an invalid ISBN
    cy.contains('button', 'Add Unit').click();
    cy.contains('Add New Book Unit').should('be.visible');
    cy.get('.dialog input').eq(0).type(validUnitData.language);
    cy.get('.dialog input').eq(1).type(validUnitData.pageCount);
    cy.get('.dialog input').eq(2).type(validUnitData.coverImageLink);
    cy.get('.dialog input').eq(3).type(validUnitData.publisher);
    cy.get('.dialog input').eq(4).type('invalidisbn');
    cy.get('.dialog button[type="submit"]').contains('Add Unit').click();
    cy.get('[data-cy=add-book-unit-error]').should('be.visible').and('contain', 'ISBN is invalid');
    cy.get('.dialog').should('be.visible');
    cy.contains('.unit-card', validUnitData.language).should('not.exist');
  });
}); 