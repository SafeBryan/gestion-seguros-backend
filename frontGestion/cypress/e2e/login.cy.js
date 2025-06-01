describe('Autenticación - Login y Logout del Usuario', () => {
  const url = 'http://localhost:4200/login';

  it('✅ debería iniciar sesión y cerrar sesión correctamente', () => {
    cy.allure().feature('Autenticación');
    cy.allure().story('Inicio y cierre de sesión exitoso');
    cy.allure().severity('critical');

    const start = Date.now();

    // 1️⃣ Ir al login
    cy.visit(url);
    cy.get('input[name="email"]', { timeout: 10000 }).should('exist');

    // 2️⃣ Ingresar credenciales válidas
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.get('input[name="password"]').type('0810', { force: true });

    // 3️⃣ Iniciar sesión
    cy.get('button.login-button').click({ force: true });

    // 4️⃣ Esperar módulo de inicio
    cy.contains('Seguros', { timeout: 10000 }).should('exist');

    // 5️⃣ Abrir menú de usuario
    cy.get('button[mat-icon-button]').contains('account_circle').click({ force: true });

    // 6️⃣ Esperar opción de cerrar sesión y hacer clic
    cy.contains('button', 'Cerrar Sesión', { timeout: 10000 }).should('exist').click({ force: true });

    // 7️⃣ Validar retorno al login
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('input[name="email"]').should('exist');

    const end = Date.now();
    const duration = end - start;
    cy.log(`⏱ Tiempo total: ${duration} ms`);
    cy.allure().step(`Tiempo total: ${duration} ms`);
  });

  it('❌ debería fallar con credenciales incorrectas', () => {
    cy.allure().feature('Autenticación');
    cy.allure().story('Inicio fallido');
    cy.allure().severity('normal');

    // 1️⃣ Ir al login
    cy.visit(url);
    cy.get('input[name="email"]', { timeout: 10000 }).should('exist');

    // 2️⃣ Ingresar datos erróneos
    cy.get('input[name="email"]').type('usuario@falso.com', { force: true });
    cy.get('input[name="password"]').type('claveincorrecta', { force: true });

    // 3️⃣ Intentar login
    cy.get('button.login-button').click({ force: true });

    // 4️⃣ Verificar mensaje de error
    cy.contains('Credenciales incorrectas', { timeout: 10000 }).should('exist');
  });
});
