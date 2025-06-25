describe('Gestión de Reembolsos como Admin', () => {
  const emailAdmin = 'b@email.com';
  const password = '0810';

  it('✅ Debería ver detalle, comentar y aprobar el primer reembolso', () => {
    // 1️⃣ Iniciar sesión como admin
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="email"]').type(emailAdmin, { force: true });
    cy.get('input[name="password"]').type(password, { force: true });
    cy.get('button.login-button').click({ force: true });

    // 2️⃣ Ir a Reembolsos
    cy.contains('Reembolsos', { timeout: 10000 }).click({ force: true });
    cy.contains('Reembolsos Pendientes', { timeout: 10000 }).should('exist');

    // 3️⃣ Esperar íconos de "ver detalle"
    cy.get('mat-icon')
      .contains('visibility', { timeout: 10000 })
      .first()
      .parents('button')
      .click({ force: true });

    // 4️⃣ Validar apertura del diálogo de detalle
    cy.contains('Detalle del Reembolso', { timeout: 10000 }).should('be.visible');

    // 5️⃣ Agregar comentario
    cy.get('mat-form-field textarea[matInput]').type('Todo correcto. Aprobado.', { force: true });

    // 6️⃣ Clic en "Aprobar"
    cy.get('button.approve-btn').click({ force: true });

  });
});
