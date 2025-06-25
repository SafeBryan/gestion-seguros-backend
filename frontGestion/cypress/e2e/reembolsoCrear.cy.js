describe('Flujo de solicitud de reembolso - Cliente', () => {
  const emailCliente = 'l@email.com';
  const passwordCliente = '0810';

  it('Debe crear un reembolso exitosamente', () => {
    // 1️⃣ Login del cliente
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="email"]').type(emailCliente, { force: true });
    cy.get('input[name="password"]').type(passwordCliente, { force: true });
    cy.get('button.login-button').click({ force: true });

    // 2️⃣ Esperar a que cargue el módulo de Seguros (u otra confirmación de login)
    cy.contains('Pedir Reembolso', { timeout: 10000 }).click({ force: true });

    // 3️⃣ Esperar que se carguen los contratos
    cy.get('mat-select[formControlName="contratoId"]', { timeout: 10000 }).should('be.visible').click();
    cy.get('mat-option').first().click({ force: true });

    // 4️⃣ Descripción del gasto
    cy.get('textarea[formControlName="descripcion"]').type('Consulta médica general por gripe', { force: true });

    // 5️⃣ Monto
    cy.get('input[formControlName="monto"]').type('75.50', { force: true });

    // 6️⃣ Médico y motivo
    cy.get('input[formControlName="nombreMedico"]').type('Dr. Juan Pérez', { force: true });
    cy.get('input[formControlName="motivoConsulta"]').type('Fiebre y malestar general', { force: true });

    // 7️⃣ Código CIE-10
    cy.get('input[formControlName="cie10"]').type('J06.9', { force: true });

    // 8️⃣ Fecha de atención
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    cy.get('input[formControlName="fechaAtencion"]').type(today, { force: true });

    // 9️⃣ Inicio de síntomas (opcional)
    cy.get('input[formControlName="inicioSintomas"]').type(today, { force: true });

    // 🔟 Adjuntar archivo PDF (opcional si no es requerido)
    const fileName = 'reembolso_factura.pdf';
    cy.fixture(fileName, 'base64').then(fileContent => {
      cy.get('input[type="file"]')
        .attachFile({ fileContent, fileName, mimeType: 'application/pdf', encoding: 'base64' });
    });

    // 1️⃣1️⃣ Marcar accidente y dar detalles (opcional)
    cy.get('mat-checkbox.accident-checkbox input').check({ force: true });
    cy.get('textarea[formControlName="detalleAccidente"]').type('Caída en casa', { force: true });

    // 1️⃣2️⃣ Enviar
    cy.get('button[type="submit"]').click({ force: true });
  });
});
