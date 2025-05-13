import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

describe('IconService', () => {
  let service: IconService;
  let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    matIconRegistrySpy = jasmine.createSpyObj('MatIconRegistry', [
      'addSvgIcon',
    ]);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);
    sanitizerSpy.bypassSecurityTrustResourceUrl.and.callFake((url) => url); // devuélvelo tal cual

    TestBed.configureTestingModule({
      providers: [
        IconService,
        { provide: MatIconRegistry, useValue: matIconRegistrySpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
      ],
    });

    service = TestBed.inject(IconService);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar los íconos al crearse', () => {
    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      'assets/icons/user.svg'
    );
    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      'assets/icons/seguro.svg'
    );
    expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledWith(
      'user',
      'assets/icons/user.svg'
    );
    expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledWith(
      'seguro',
      'assets/icons/seguro.svg'
    );
  });

  it('debería devolver una copia de los íconos con getIcon()', () => {
    const icons = service.getIcon();
    expect(icons.length).toBe(2);
    expect(icons[0].name).toBe('user');

    // Verifica que sea una copia, no la referencia original
    icons.push({ name: 'otro', path: 'otro.svg' });
    expect(service.getIcon().length).toBe(2);
  });

  it('debería devolver un ícono por nombre con getIconByName()', () => {
    const icon = service.getIconByName('Seguro');
    expect(icon).toBeTruthy();
    expect(icon.name).toBe('seguro');
  });
});
