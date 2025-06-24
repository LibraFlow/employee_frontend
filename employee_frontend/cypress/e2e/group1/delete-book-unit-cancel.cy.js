describe('Delete Book Unit - Cancel', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = 'Cypress Book For Delete Unit Cancel';
  const unitData = {
    language: 'CancelLang',
    pageCount: '555',
    coverImageLink: 'https://example.com/cancel.jpg',
    publisher: 'Cancel Publisher',
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
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'Book for unit delete cancel test.'
    };
    
    cy.addBookReliably(bookData);

    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.units-button').click();
      });
    cy.contains('Book Units').should('be.visible');

    cy.contains('button', 'Add Unit').click();
    cy.waitForDialog();
    
    cy.get('.dialog').within(() => {
      cy.get('input').eq(0).type(unitData.language);
      cy.get('input').eq(1).type(unitData.pageCount);
      cy.get('input').eq(2).type(unitData.coverImageLink);
      cy.get('input').eq(3).type(unitData.publisher);
      cy.get('input').eq(4).type(unitData.isbn);
      cy.get('button[type="submit"]').contains('Add Unit').click();
    });
    
    cy.waitForElementToDisappear('.dialog');
    cy.get('.unit-card').should('exist');
    cy.get('.unit-card').should('contain.text', unitData.language);
  });

  it('should show the confirmation modal and cancel deletion', () => {
    cy.navigateToGenre('Fantasy');
    
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.units-button').click();
      });
    cy.contains('Book Units').should('be.visible');
    
    cy.get('.unit-card').last().within(() => {
      cy.get('.delete-button').click();
    });
    
    cy.get('.modal').should('be.visible');
    cy.get('[data-cy=cancel-delete-unit]').click();
    
    cy.waitForElementToDisappear('.modal');
    cy.get('.unit-card').should('exist');
    cy.get('.unit-card').should('contain.text', unitData.language);
  });
}); 