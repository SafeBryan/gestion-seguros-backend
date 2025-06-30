describe('Flujo completo de gestión de seguros', () => {
  const nombreSeguro = `Seguro Cypress ${Date.now()}`;
  const descripcion = 'Seguro creado para pruebas automatizadas con Cypress';
  const nuevaDescripcion = 'Actualizado por Cypress para fines de prueba';
  const precioAnual = '1500';
  const cobertura1 = 'Fallecimiento Natural';
  const cobertura2 = 'Invalidez Permanente';

  it('Debe crear, editar y desactivar un seguro', () => {
    // 1. Ir al login
    cy.visit('http://localhost:4200/login');

    // 2. Iniciar sesión
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.get('input[name="password"]').type('0810', { force: true });
    cy.get('button.login-button').click({ force: true });

    // 3. Ir al módulo de Seguros
    cy.contains('a', 'Seguros').click();

    // 4. Abrir el modal para crear seguro
    cy.get('button.add-button').click();

    // 5. Llenar el formulario del seguro
    cy.get('input[formcontrolname="nombre"]').type(nombreSeguro);

    cy.get('mat-select[formcontrolname="tipo"]').click();
    cy.get('mat-option').contains('Seguro de Vida').click();

    cy.get('input[formcontrolname="precioAnual"]').clear().type(precioAnual);
    cy.get('textarea[formcontrolname="descripcion"]').type(descripcion);

    // Seleccionar coberturas múltiples
    cy.get('mat-select[formcontrolname="cobertura"]').click();
    cy.get('mat-option').contains(cobertura1).click();
    cy.get('mat-option').contains(cobertura2).click();

    // 6. Crear el seguro (forzado para evitar bloqueo del overlay)
    cy.contains('button', 'Crear Seguro').click({ force: true });
    cy.contains('Seguro creado exitosamente').should('exist');

    // 7. Buscar y editar el seguro creado
// 7. Buscar y editar el seguro creado
cy.contains('mat-card-title', nombreSeguro)
  .parents('mat-card')
  .within(() => {
    cy.get('button[mattooltip="Editar seguro"]').click();
      });

    // Evitar que falle por validación al reescribir campos requeridos
    cy.get('input[formcontrolname="nombre"]').clear().type(nombreSeguro);
    cy.get('textarea[formcontrolname="descripcion"]').clear().type(nuevaDescripcion);

    cy.contains('button', 'Actualizar Seguro').click({ force: true });
    cy.contains('Seguro actualizado exitosamente').should('exist');


    // 8. Desactivar el seguro
    cy.contains('mat-card-title', nombreSeguro)
      .parents('mat-card')
      .within(() => {
        cy.get('button[mattooltip="Desactivar seguro"]').click();
      });

    cy.on('window:confirm', () => true); // Aceptar confirmación
    cy.contains('Seguro desactivado exitosamente').should('exist');
  });
});
