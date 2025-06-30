describe('Flujo completo de creación de contrato con beneficiario', () => {
  it('debe crear un contrato con todos los datos obligatorios', () => {
    const today = '06/25/2025'; // Formato compatible con el datepicker
    const oneYearLater = '06/24/2026';

    cy.visit('http://localhost:4200/login');

    // Login
    cy.get('input[name="email"]').type('b@email.com');
    cy.get('input[name="password"]').type('0810');
    cy.get('button.login-button').click();

    // Ir al módulo contratos
    cy.contains('a', 'Contratos', { timeout: 10000 }).click();

    // Crear nuevo contrato
    cy.contains('Nuevo Contrato').scrollIntoView().click();

    // Seleccionar cliente
    cy.get('mat-select[name="clienteId"]', { timeout: 10000 }).should('be.visible').click();
    cy.get('mat-option').should('have.length.at.least', 1).first().click();

    // Seleccionar seguro
    cy.get('mat-select[name="seguroId"]').should('be.visible').click();
    cy.get('mat-option').should('have.length.at.least', 1).first().click();

    // Seleccionar agente
    cy.get('mat-select[name="agenteId"]').should('be.visible').click();
    cy.get('mat-option').should('have.length.at.least', 1).first().click();

    // Fechas
    cy.get('input[name="fechaInicio"]')
      .should('be.visible')
      .clear()
      .type(today, { force: true });

    cy.get('input[name="fechaFin"]')
          .click({ force: true }) // <-- agregado
          .clear({ force: true })
          .type(oneYearLater, { force: true });

    // Frecuencia de pago
    cy.get('mat-select[name="frecuenciaPago"]').should('be.visible').click();
    cy.get('mat-option').should('have.length.at.least', 1).first().click();


    // Esperar a que el campo del beneficiario esté visible
    cy.get('input[name="nombre0"]:not([disabled])', { timeout: 10000 })
      .click({ force: true })
      .clear({ force: true })
      .type('Juan Pérez', { force: true });


    cy.get('input[name="numeroIdentificacion0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('1234567890', { force: true });

cy.get('input[name="fechaNacimiento0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('01/01/1990', { force: true });

cy.get('input[name="nacionalidad0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('Ecuatoriano', { force: true });

cy.contains('mat-form-field', 'Parentesco') // busca el campo completo
  .find('mat-select')
  .click({ force: true });

cy.get('mat-option', { timeout: 10000 })
  .should('have.length.at.least', 1)
  .first()
  .click({ force: true });

cy.get('input[name="estatura0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('1.75', { force: true });

cy.get('input[name="peso0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('70', { force: true });

cy.get('input[name="lugarNacimiento0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('Ambato', { force: true });

cy.get('input[name="porcentaje0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('100', { force: true });

cy.get('input[name="email0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('juan@example.com', { force: true });

cy.get('input[name="telefono0"]:not([disabled])', { timeout: 10000 })
  .click({ force: true })
  .clear({ force: true })
  .type('0987654321', { force: true });


    // Guardar
    cy.get('button[type="submit"]').contains('Guardar').click();

    // Verificación
    cy.get('app-contratos-list', { timeout: 10000 }).should('exist');
    cy.contains('ACTIVO', { timeout: 10000 }).should('exist');
    
  });
  
});
