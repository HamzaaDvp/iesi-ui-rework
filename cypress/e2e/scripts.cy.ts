describe('Scripts spec', () => {
  let token: string;

  it('With no access token, should access to Scripts overview after logged in', () => {
    cy.visit('http://localhost:3000/scripts');
    cy.intercept('POST', '/api/login*').as('login');
    cy.get('input[id="login-form-username"').type('admin');
    cy.get('input[id="login-form-password"').type('admin');
    cy.get('form').submit();
    cy.wait('@login');
    cy.getCookie('next-auth-session').should('exist');
    cy.visit('http://localhost:3000/scripts');
    cy.get('head > title').should('contain', 'Scripts overview');
    cy.getCookie('next-auth-session').then((c) => {
      token = c?.value || '';
    });
  });

  it('With an expired access token, should access to the Scripts Overview page', () => {
    cy.setCookie('next-auth-session', token);
    cy.visit('http://localhost:3000/scripts');
    cy.get('head > title').should('contain', 'Scripts overview');
    cy.wait(15000);
    cy.reload();
    cy.get('head > title').should('contain', 'Scripts overview');
  });

  it('With an expired token, should stay on the Scripts overview page', () => {
    cy.visit('http://localhost:3000/scripts');
    cy.intercept('http://localhost:3000/api/*').as('login');
    cy.get('input[id="login-form-username"').type('admin');
    cy.get('input[id="login-form-password"').type('admin');
    cy.get('form').submit();
    cy.wait('@login');
    cy.getCookie('next-auth-session').should('exist');
    cy.visit('http://localhost:3000/scripts');
    cy.get('head > title').should('contain', 'Scripts overview');
    cy.getCookie('next-auth-session').then((c) => {
      token = c?.value || '';
    });

    cy.get('head > title').should('contain', 'Scripts overview');
  });

  it('With no token, to be redirected to the login page', () => {
    cy.visit('http://localhost:3000/scripts');
    cy.get('head > title').should('contain', 'IESI login page');
  });

  it('With an invalid token, to be redirected to the login page', () => {
    cy.setCookie('next-auth-session', 'Hello world');
    cy.visit('http://localhost:3000/scripts');
    cy.get('head > title').should('contain', 'IESI login page');
  });
});

export {};
