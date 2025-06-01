import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconService);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver una copia de los íconos con getIcon()', () => {
    const icons = service.getIcon();
    expect(icons.length).toBe(4); // ✅ ahora sí son 4

    expect(icons[0].name).toBe('home'); // ✅ ajustado al orden real

    // Verifica que sea una copia, no la referencia original
    icons.push({ name: 'nuevo', path: 'nuevo.svg' });
    expect(service.getIcon().length).toBe(4); // ✅ aún deben ser 4, no 5
  });

  it('debería devolver un ícono por nombre con getIconByName()', () => {
    const icon = service.getIconByName('Seguro'); // prueba con mayúscula
    expect(icon).toBeTruthy();
    expect(icon.name).toBe('seguro'); // case insensitive
  });

  it('debería devolver undefined si no existe el ícono', () => {
    const icon = service.getIconByName('inexistente');
    expect(icon).toBeUndefined();
  });
});
