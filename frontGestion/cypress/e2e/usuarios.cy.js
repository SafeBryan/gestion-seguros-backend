describe('Flujo completo de gestión de usuarios', () => {
  const testEmail = `test.cypress+${Date.now()}@example.com`;
  const password = '0810';
  const nombre = 'Cypress';
  const apellido = 'Tester';
  const telefono = '0999999999';

  it('Debe crear, editar y desactivar un usuario', () => {
    // 1. Ir al login
    cy.visit('http://localhost:4200/login');
    cy.wait(2000);

    // 2. Iniciar sesión
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.wait(1000);
    cy.get('input[name="password"]').type(password, { force: true });
    cy.wait(1000);
    cy.get('button.login-button').click({ force: true });
    cy.wait(3000);

    // 3. Ir al módulo de Usuarios
    cy.contains('a', 'Usuarios').click();
    cy.wait(2000);

    // 4. Abrir modal para crear usuario
    cy.get('button.add-button').click();
    cy.wait(1500);

    // 5. Llenar formulario de creación
    cy.get('input[name="email"]').type(testEmail);
    cy.wait(500);
    cy.get('input[name="password"]').type(password, { force: true });
    cy.wait(500);
    cy.get('input[name="nombre"]').type(nombre);
    cy.wait(500);
    cy.get('input[name="apellido"]').type(apellido);
    cy.wait(500);
    cy.get('input[name="telefono"]').type(telefono);
    cy.wait(500);
    cy.get('mat-select[name="rolId"]').click();
    cy.wait(500);
    cy.get('mat-option').eq(1).click(); // Asigna un rol (ajustar si es necesario)
    cy.wait(500);

    // 6. Crear el usuario
    cy.contains('button', 'Guardar').click();
    cy.wait(3000);
    cy.contains('Usuario creado correctamente').should('exist');
    cy.wait(2000);

    // 7. Buscar el usuario creado y editarlo
    cy.get('input[placeholder="Nombre, email, rol..."]').clear().type(testEmail);
    cy.wait(1500);
    cy.get('tr.usuario-row').first().within(() => {
      cy.get('button[mattooltip="Editar"]').click();
    });
    cy.wait(1500);

    // 8. Cambiar el rol del usuario
    cy.get('mat-select[name="rolId"]').click();
    cy.wait(500);
    cy.get('mat-option').eq(3).click(); // Nuevo rol (ajustar si es necesario)
    cy.wait(500);
    cy.contains('button', 'Guardar').click();
    cy.wait(3000);
    cy.contains('Usuario editado correctamente').should('exist');
    cy.wait(2000);

    // 9. Buscar y desactivar el usuario
    cy.get('input[placeholder="Nombre, email, rol..."]').clear().type(testEmail);
    cy.wait(1500);
    cy.get('tr.usuario-row').first().within(() => {
      cy.get('button[mattooltip="Eliminar"]').click();
    });
    cy.wait(1000);

    // Confirmar eliminación
    cy.contains('Eliminar').click();
    cy.wait(2000);
    cy.contains('Usuario eliminado correctamente').should('exist');
    cy.wait(1000);
  });
});
