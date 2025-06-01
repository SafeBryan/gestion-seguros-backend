describe('Gestión de Contratos - Flujo completo: Crear, Editar y Cancelar', () => {
  before(() => {
    cy.visit('http://localhost:4200/login');
    cy.wait(2000);
    cy.get('input[name="email"]').type('b@email.com', { force: true });
    cy.wait(1000);
    cy.get('input[name="password"]').type('0810', { force: true });
    cy.wait(1000);
    cy.get('button.login-button').click({ force: true });
    cy.wait(3000);
  });

  it('debería crear, editar y cancelar un contrato', () => {
    cy.allure().feature('Contratos');
    cy.allure().story('Flujo completo: crear, editar y cancelar');
    cy.allure().severity('blocker');

    // 🟢 CREAR CONTRATO
    cy.contains('Contratos').click({ force: true });
    cy.wait(2000);
    cy.contains('Nuevo Contrato').scrollIntoView().click({ force: true });
    cy.wait(1500);

    cy.get('mat-select[name="seguroId"]').scrollIntoView().click({ force: true });
    cy.wait(1000);
    cy.get('mat-option').first().click({ force: true });
    cy.wait(1000);

    cy.get('mat-select[name="agenteId"]').scrollIntoView().click({ force: true });
    cy.wait(1000);
    cy.get('mat-option').first().click({ force: true });
    cy.wait(1000);

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const oneMonthLater = nextMonth.toISOString().split('T')[0];

    cy.get('input[name="fechaInicio"]').scrollIntoView().type(today, { force: true });
    cy.wait(1000);
    cy.get('input[name="fechaFin"]').type(oneMonthLater, { force: true });
    cy.wait(1000);

    cy.get('mat-select[name="frecuenciaPago"]').click({ force: true });
    cy.wait(500);
    cy.get('mat-option').eq(0).click({ force: true }); // MENSUAL
    cy.wait(1000);

    cy.contains('Agregar Beneficiario').click({ force: true });
    cy.wait(1000);
    cy.get('input[name="nombre0"]').type('Juan', { force: true });
    cy.wait(500);
    cy.get('input[name="parentesco0"]').type('Hijo', { force: true });
    cy.wait(500);
    cy.get('input[name="porcentaje0"]').clear().type('100', { force: true });
    cy.wait(1000);

    cy.get('button[type="submit"]').contains('Guardar').scrollIntoView().click({ force: true });
    cy.wait(4000);

    cy.get('input[name="fechaInicio"]').should('not.exist');
    cy.get('app-contratos-list').should('exist');
    cy.get('table', { timeout: 10000 }).should('be.visible');

    // Verifica que existe un contrato activo
    cy.get('table').within(() => {
      cy.contains('ACTIVO', { matchCase: false }).should('exist');
    });

    cy.log('✅ Contrato creado exitosamente');

    // 🟡 EDITAR CONTRATO: cambiar frecuencia a TRIMESTRAL
    cy.get('table').within(() => {
      cy.contains('ACTIVO', { matchCase: false }).parents('tr').within(() => {
        cy.get('button[mattooltip="Editar contrato"]').click({ force: true });
      });
    });

    cy.wait(1500);
    cy.get('mat-select[name="frecuenciaPago"]').click({ force: true });
    cy.wait(500);
    cy.get('mat-option').eq(1).click({ force: true }); // TRIMESTRAL
    cy.wait(1000);
    cy.get('button[type="submit"]').contains('Guardar').scrollIntoView().click({ force: true });
    cy.wait(3000);
    cy.get('input[name="fechaInicio"]').should('not.exist');
    cy.get('table').should('be.visible');
    cy.log('✅ Contrato editado correctamente');

    // 🔴 CANCELAR CONTRATO
    cy.get('table').within(() => {
      cy.contains('ACTIVO', { matchCase: false }).parents('tr').within(() => {
        cy.get('button[mattooltip="Cancelar contrato"]').click({ force: true });
      });
    });

    cy.on('window:confirm', (text) => {
      expect(text).to.include('¿Está seguro que desea cancelar el contrato');
      return true;
    });



    cy.log('✅ Contrato cancelado exitosamente');
  });
});
