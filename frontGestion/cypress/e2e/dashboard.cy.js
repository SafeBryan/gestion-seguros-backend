describe('Dashboard - Gestión de Seguros', () => {
  before(() => {
    cy.visit('http://localhost:4200/login');
    cy.wait(2000);
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.get('input[name="password"]').type('0810', { force: true });
    cy.get('button.login-button').click({ force: true });
    cy.wait(4000);
  });

  it('debería mostrar correctamente los contadores y listas en el dashboard', () => {
    cy.allure().feature('Dashboard');
    cy.allure().story('Carga de estadísticas y últimas entradas');
    cy.allure().severity('critical');

    cy.contains('Dashboard de Gestión de Seguros').should('exist');
    cy.wait(1000);
    cy.contains('Usuarios Totales').scrollIntoView().should('exist');
    cy.contains('Usuarios Activos').should('exist');
    cy.contains('Seguros Totales').should('exist');
    cy.contains('Seguros Activos').should('exist');

    cy.contains('Acceso Rápido').scrollIntoView().should('exist');
    cy.get('a[routerlink="/usuarios"]').should('be.visible');
    cy.get('a[routerlink="/seguros"]').should('be.visible');

    cy.contains('Últimos Usuarios Registrados').scrollIntoView().should('exist');
    cy.contains('Últimos Seguros Registrados').should('exist');

    cy.get('button[mat-mini-fab]').click({ force: true });
    cy.wait(3000);

    cy.log('✅ Dashboard verificado con éxito');
  });
});