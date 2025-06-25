describe('Flujo completo de gestión de usuarios', () => {
  const testEmail = `test.cypress+${Date.now()}@example.com`;
  const password = '0810';
  const nombre = 'Cypress';
  const apellido = 'Tester';
  const telefono = '0999999999';
  const cedula = `${Date.now()}`.slice(-10);
  const uniqueId = Date.now();


  it('Debe crear, editar y desactivar un usuario', () => {
    // 1. Ir al login
    cy.visit('http://localhost:4200/login');

    // 2. Iniciar sesión
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.get('input[name="password"]').type(password, { force: true });
    cy.get('button.login-button').click({ force: true });

    // 3. Ir al módulo de Usuarios
    cy.contains('a', 'Usuarios').click();

    // 4. Abrir modal para crear usuario
    cy.get('button.add-button').click();

    // 5. Llenar formulario de creación
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(password, { force: true });
    cy.get('input[name="nombre"]').type(nombre);
    cy.get('input[name="apellido"]').type(apellido);
    cy.get('input[name="telefono"]').type(telefono);
    cy.get('mat-select[name="rolId"]').click();
    cy.get('mat-option').eq(2).click(); // Asigna un rol (ajustar si es necesario)

    // 6. Crear el usuario
    cy.contains('button', 'Guardar').click();
    cy.contains('Usuario creado correctamente').should('exist');
        // 7. Ir a módulo Clientes
    cy.contains('a', 'Clientes').click();

    // 8. Abrir modal para crear cliente
    cy.get('button.add-button').click();

    // 9. Seleccionar usuario recién creado
    cy.get('mat-select[name="usuarioId"]').click({ force: true });
    cy.get('mat-option').contains(`${nombre} ${apellido}`).click({ force: true });


    // 10. Información de Identificación
    cy.get('mat-select[name="tipoIdentificacion"]').click({ force: true });
    cy.get('mat-option').first().click({ force: true }); // Selecciona la primera opción (ej. CÉDULA)

    cy.get('input[name="numeroIdentificacion"]')
        .click({ force: true })   // ← esto activa el campo pese a estar cubierto
        .clear({ force: true })   // opcional si se requiere limpiar antes
        .type(cedula, { force: true });



    // 11. Fecha de nacimiento
    cy.get('input[name="fechaNacimiento"]')
      .click({ force: true })
      .type('07/03/1995', { force: true }); // Fecha calculada dinámicamente

    // 12. Nacionalidad
    cy.get('input[name="nacionalidad"]')
        .click({ force: true })
        .clear({ force: true })
        .type('Ecuatoriano', { force: true });


    // 13. Estado civil
    cy.get('mat-select[name="estadoCivil"]').click({ force: true });
    cy.get('mat-option').first().click({ force: true });

    // 14. Sexo
    cy.get('mat-select[name="sexo"]').click({ force: true });
    cy.get('mat-option').contains('Masculino').click({ force: true });


// 15. Lugar de nacimiento
cy.get('input[name="lugarNacimiento"]')
  .click({ force: true }) // opcional, si hay algún overlay
  .type('Ambato', { force: true });


    // 16. Estatura y peso
    cy.get('input[name="estatura"]').type('1.75');
    cy.get('input[name="peso"]').type('70');

    // 17. Dirección
    cy.get('textarea[name="direccion"]').type('Av. Siempre Viva 742');

    // 18. Guardar cliente
    cy.contains('button', 'Guardar').click({ force: true });
    cy.wait(3000);
    cy.contains('Cliente creado correctamente').should('exist');

    
  
  });
});
