describe('Facebook Login Page Complex Regression Suite', () => {
  beforeEach(() => {
    // Visit the Facebook login page before each test
    cy.visit('https://www.facebook.com/');
  });

  it('should load the Facebook login page with correct elements', () => {
    // Verify that the login form and key elements are visible
    cy.get('#email').should('be.visible');
    cy.get('#pass').should('be.visible');
    cy.get('button[name="login"]').should('be.visible');
    cy.get('a[title="Forgotten password?"]').should('be.visible');
    cy.contains('Create new account').should('be.visible');
    cy.contains('Create a Page').should('be.visible');
  });

  it('should display error messages for various invalid logins', () => {
    const invalidEmails = ['invalid', 'invalid@', 'invalid@domain', 'invalid@domain.'];
    const invalidPasswords = ['', 'short', '123456'];

    invalidEmails.forEach(email => {
      invalidPasswords.forEach(password => {
        cy.get('#email').clear().type(email);
        cy.get('#pass').clear().type(password);
        cy.get('button[name="login"]').click();
        cy.get('#error_box').should('be.visible');
      });
    });
  });

  it('should retain input values after a failed login attempt', () => {
    const testEmail = 'invalid@example.com';
    const testPassword = 'invalidpassword';

    cy.get('#email').type(testEmail);
    cy.get('#pass').type(testPassword);
    cy.get('button[name="login"]').click();

    cy.get('#email').should('have.value', testEmail);
    cy.get('#pass').should('have.value', testPassword);
  });

  it('should redirect to forgot password page correctly', () => {
    cy.contains('Forgotten password?').click();
    cy.url().should('include', 'recover');
  });

  it('should handle localization and language change', () => {
    cy.get('a[title="Español"]').click();
    cy.get('html').should('have.attr', 'lang', 'es');
  });

  it('should verify UI elements\' states and styles', () => {
    cy.get('#email').should('have.css', 'border-color', 'rgb(240, 240, 240)');
    cy.get('#pass').should('have.css', 'border-color', 'rgb(240, 240, 240)');
    cy.get('button[name="login"]').should('have.css', 'background-color', 'rgb(24, 119, 242)');
  });

  it('should maintain session storage and cookies after login attempt', () => {
    cy.get('#email').type('invalid@example.com');
    cy.get('#pass').type('invalidpassword');
    cy.get('button[name="login"]').click();

    cy.getCookies().should('not.be.empty');
    cy.window().then((win) => {
      expect(win.sessionStorage.length).to.be.greaterThan(0);
    });
  });

  it('should handle network requests correctly', () => {
    cy.intercept('POST', '/login').as('loginRequest');
    cy.get('#email').type('invalid@example.com');
    cy.get('#pass').type('invalidpassword');
    cy.get('button[name="login"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
  });

  it('should have a working "Create New Account" link', () => {
    cy.contains('Create new account').click();
    cy.get('div[data-testid="open-registration-form-button"]').should('be.visible');
  });

  it('should have a working "Create a Page" link', () => {
    cy.contains('Create a Page').click();
    cy.url().should('include', 'pages/create');
  });

  it('should test login with valid credentials', () => {
    // Ensure you replace the following credentials with valid ones for testing
    const validEmail = 'your-valid-email@example.com';
    const validPassword = 'your-valid-password';

    cy.get('#email').type(validEmail);
    cy.get('#pass').type(validPassword);
    cy.get('button[name="login"]').click();

    // Validate successful login by checking URL or an element visible only after login
    cy.url().should('not.include', 'login');
    cy.get('nav').should('be.visible');
  });
});
