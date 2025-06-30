import { TestBed } from '@angular/core/testing';
import { MenuService, IMenu } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return admin menu for ADMIN role', () => {
    const result: IMenu[] = service.getMenuByRol('ADMIN');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((item) => item.title === 'Usuario')).toBeTrue();
  });

  it('should return admin menu for AGENTE role', () => {
    const result: IMenu[] = service.getMenuByRol('AGENTE');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((item) => item.title === 'Contratos')).toBeTrue();
  });

  it('should return client menu for CLIENTE role', () => {
    const result: IMenu[] = service.getMenuByRol('CLIENTE');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((item) => item.title === 'Mis Contratos')).toBeTrue();
  });

  it('should return default menu for unknown role', () => {
    const result: IMenu[] = service.getMenuByRol('DESCONOCIDO');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Inicio');
    expect(result[0].url).toBe('/home');
  });

  it('should return a deep copy of menu (not reference)', () => {
    const adminMenu = service.getMenuByRol('ADMIN');
    adminMenu[0].title = 'Modificado';
    const freshMenu = service.getMenuByRol('ADMIN');
    expect(freshMenu[0].title).toBe('Inicio'); // original title, not modified
  });
});
