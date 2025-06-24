describe('Edit Book Unit - Invalid Input', () => {
  const uniqueId = Math.floor(Math.random() * 1000);
  const testUser = {
    username: `admin${uniqueId}`,
    password: 'password123!',
    email: `admin${uniqueId}@libraflow.com`,
    address: '123 Library St',
    phone: '+1234567890',
  };
  const bookTitle = `Cypress Book For Edit Unit Invalid ${uniqueId}`;
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

  it('should show an error for invalid cover image link when editing a book unit', () => {
    // Add a new book
    cy.navigateToGenre('Fantasy');
    
    const bookData = {
      title: bookTitle,
      author: 'Cypress Author',
      year: '2024',
      description: 'Book for edit unit invalid test.'
    };
    
    cy.addBookReliably(bookData);

    // Go to the book's units page
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.units-button').click();
      });
    cy.contains('Book Units').should('be.visible');

    // Add a valid book unit
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

    // Edit the book unit with an invalid image link
    cy.get('.unit-card').last().within(() => {
      cy.get('.edit-button').click();
    });
    
    cy.waitForDialog();
    cy.get('.dialog').within(() => {
      cy.get('input').eq(2).clear().type('https://example.com/not-an-image.txt');
      cy.get('button[type="submit"]').contains('Save Changes').click();
    });
    
    cy.get('[data-cy=edit-book-unit-error]').should('be.visible').and('contain', 'Cover image link must be a valid image URL');
    cy.get('.dialog').should('be.visible');
  });

  it('should show an error for invalid ISBN when editing a book unit', () => {
    // Navigate to the book's units page (book already created in previous test)
    cy.navigateToGenre('Fantasy');
    cy.contains('.book-title', bookTitle)
      .closest('.book-card')
      .within(() => {
        cy.get('.units-button').click();
      });
    cy.contains('Book Units').should('be.visible');

    // Edit the book unit with an invalid ISBN
    cy.get('.unit-card').last().within(() => {
      cy.get('.edit-button').click();
    });
    
    cy.waitForDialog();
    cy.get('.dialog').within(() => {
      cy.get('input').eq(4).clear().type('invalidisbn');
      cy.get('button[type="submit"]').contains('Save Changes').click();
    });
    
    cy.get('[data-cy=edit-book-unit-error]').should('be.visible').and('contain', 'ISBN is invalid');
    cy.get('.dialog').should('be.visible');
  });
}); 