import { TestBed } from '@angular/core/testing';
import { MenuService, IMenu } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver una copia del menú con getMenu()', () => {
    const menu = service.getMenu();
    expect(menu.length).toBe(4);
    expect(menu[0].title).toBe('Inicio');

    // verificar que no sea la misma referencia
    menu.push({ title: 'Extra', url: '/extra', icon: 'extra' });
    expect(service.getMenu().length).toBe(4);
  });

  it('debería encontrar el menú por URL ignorando mayúsculas/minúsculas', () => {
    const menu = service.getMenuByUrl('/USUARIOS');
    expect(menu).toBeTruthy();
    expect(menu?.title).toBe('Usuario');
  });

  it('debería retornar undefined si no encuentra la URL', () => {
    // eliminamos el cast forzado a IMenu para poder retornar undefined correctamente
    const menu = service.getMenuByUrl('/no-existe');
    expect(menu).toBeUndefined();
  });
});
