describe('Flujo completo de gestión de seguros', () => {
  const nombreSeguro = `Seguro Cypress ${Date.now()}`;
  const descripcion = 'Seguro creado para pruebas automatizadas con Cypress';
  const cobertura = 'Cubre eventos imprevistos en la vida del asegurado';
  const precioAnual = '1500';
  const beneficiarios = 'Cónyuge, Hijos';
  const montoCobertura = '10000';

  it('Debe crear, editar y desactivar un seguro', () => {
    // 1. Ir al login
    cy.visit('http://localhost:4200/login');
    cy.wait(2000);

    // 2. Iniciar sesión
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.wait(1000);
    cy.get('input[name="password"]').type('0810', { force: true });
    cy.wait(1000);
    cy.get('button.login-button').click({ force: true });
    cy.wait(3000);

    // 3. Ir a módulo de Seguros
    cy.contains('a', 'Seguros').click();
    cy.wait(2000);

    // 4. Abrir modal para crear seguro
    cy.get('button.add-button').click();
    cy.wait(1500);

    // 5. Llenar formulario de seguro (tipo VIDA)
    cy.get('input[formcontrolname="nombre"]').type(nombreSeguro);
    cy.wait(500);
    cy.get('mat-select[formcontrolname="tipo"]').click();
    cy.wait(500);
    cy.get('mat-option').contains('Seguro de Vida').click();
    cy.wait(1000);
    cy.get('input[formcontrolname="precioAnual"]').clear().type(precioAnual);
    cy.wait(500);
    cy.get('textarea[formcontrolname="descripcion"]').type(descripcion);
    cy.wait(500);
    cy.get('textarea[formcontrolname="cobertura"]').type(cobertura);
    cy.wait(500);

    // 6. Crear el seguro
    cy.contains('button', 'Crear Seguro').click();
    cy.wait(3000);
    cy.contains('Seguro creado exitosamente').should('exist');
    cy.wait(2000);

    // 7. Buscar el seguro creado y editarlo
    cy.contains('mat-card-title', nombreSeguro)
      .parents('mat-card')
      .within(() => {
        cy.get('button[mattooltip="Editar seguro"]').click();
      });
    cy.wait(2000);

    // 8. Modificar descripción
    const nuevaDescripcion = 'Actualizado por Cypress para fines de prueba';
    cy.get('textarea[formcontrolname="descripcion"]').clear().type(nuevaDescripcion);
    cy.wait(1000);

    // 9. Guardar edición
    cy.contains('button', 'Actualizar Seguro').click();
    cy.wait(3000);
    cy.contains('Seguro actualizado exitosamente').should('exist');
    cy.wait(2000);

    // 10. Buscar y desactivar el seguro
    cy.contains('mat-card-title', nombreSeguro)
      .parents('mat-card')
      .within(() => {
        cy.get('button[mattooltip="Desactivar seguro"]').click();
      });

    cy.wait(1000);
    cy.on('window:confirm', () => true); // Confirmar el popup del navegador
    cy.wait(2000);
    cy.contains('Seguro desactivado exitosamente').should('exist');
    cy.wait(2000);
  });
});
