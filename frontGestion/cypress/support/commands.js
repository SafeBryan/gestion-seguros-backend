Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login'); 

  cy.get('input[name="email"]').type('b@email.com');
  cy.get('input[name="password"]').type('0810{enter}');


  cy.url().should('include', '/home'); 
});
