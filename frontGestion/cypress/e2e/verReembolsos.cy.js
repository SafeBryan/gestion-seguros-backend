describe('Buscar en Mis Reembolsos', () => {
  const emailCliente = 'l@email.com';
  const passwordCliente = '0810';

  it('✅ debería filtrar reembolsos por texto', () => {
    // 1️⃣ Login
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="email"]').type(emailCliente, { force: true });
    cy.get('input[name="password"]').type(passwordCliente, { force: true });
    cy.get('button.login-button').click({ force: true });

    // 2️⃣ Esperar redirección y botón "Mis Reembolsos"
    cy.contains('Mis Reembolsos', { timeout: 10000 }).click({ force: true });

    // 3️⃣ Esperar carga
    cy.get('mat-form-field.search-filter input', { timeout: 10000 }).should('exist');

    // 4️⃣ Buscar un reembolso por descripción o estado
    cy.get('mat-form-field.search-filter input').type('gripe', { force: true }); // ajusta si sabes el texto exacto

  });
});
