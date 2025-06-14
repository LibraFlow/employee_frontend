describe('Delete Book Unit', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Delete Unit ${uniqueId}`;
  const unitData = {
    language: 'DeleteLang',
    pageCount: '444',
    coverImageLink: 'https://example.com/delete.jpg',
    publisher: 'Delete Publisher',
    isbn: `0-3545-794${uniqueId % 10}-6`,
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
    cy.get('[data-cy=register-success]', { timeout: 10000 }).should('be.visible');
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=username-input]').type(testUser.username);
    cy.get('[data-cy=password-input]').type(testUser.password);
    cy.get('[data-cy=login-button]').click();
    cy.contains('Welcome to LibraFlow!').should('be.visible');
  });

  it('should add a new book and a new book unit', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('button', 'Add Book').click();
    cy.contains('Add New Book').should('be.visible');
    cy.get('.dialog input[type="text"]').eq(0).type(bookTitle);
    cy.get('.dialog input[type="text"]').eq(1).type('Cypress Author');
    cy.get('.dialog input[type="number"]').type('2024');
    cy.get('.dialog textarea').type('Book for unit delete test.');
    cy.get('.dialog button[type="submit"]').contains('Add Book').click();
    cy.contains('.book-title', bookTitle).should('be.visible');
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.units-button')
      .click();
    cy.contains('Book Units').should('be.visible');
    cy.contains('button', 'Add Unit').click();
    cy.contains('Add New Book Unit').should('be.visible');
    cy.get('.dialog input').eq(0).type(unitData.language);
    cy.get('.dialog input').eq(1).type(unitData.pageCount);
    cy.get('.dialog input').eq(2).type(unitData.coverImageLink);
    cy.get('.dialog input').eq(3).type(unitData.publisher);
    cy.get('.dialog input').eq(4).type(unitData.isbn);
    cy.get('.dialog button[type="submit"]').contains('Add Unit').click();
    cy.get('.dialog').then($dialog => {
      if ($dialog.is(':visible')) {
        cy.log($dialog.text());
      }
    });
    cy.get('.unit-card').should('exist');
    cy.get('.unit-card').should('contain.text', unitData.language);
    cy.get('.dialog .error-message').should('not.exist');
  });

  it('should delete the book unit and verify it is removed', () => {
    cy.contains('Genres').click();
    cy.contains('.genre-card', 'Fantasy').click();
    cy.contains('.book-title', bookTitle)
      .parents('.book-card')
      .find('.units-button')
      .click();
    cy.contains('Book Units').should('be.visible');
    cy.get('.unit-card').last().find('.delete-button').click();
    cy.get('.modal').should('be.visible');
    cy.get('[data-cy=confirm-delete-unit]').click();
    cy.get('.modal').should('not.exist');
    cy.contains('.unit-card', unitData.language).should('not.exist');
    cy.contains('.unit-card', unitData.publisher).should('not.exist');
    cy.contains('.unit-card', unitData.isbn).should('not.exist');
  });
}); 