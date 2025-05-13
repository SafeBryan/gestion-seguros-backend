import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService, IMenu } from '../../core/services/menu.service';
import { IconService } from '../../core/services/icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mocks personalizados
const mockMenu: IMenu[] = [
  { title: 'Inicio', url: '/home', icon: 'home' },
  { title: 'Contratos', url: '/contratos', icon: 'file' },
];

const mockIcons = [
  { name: 'home', path: 'assets/icons/home.svg' },
  { name: 'file', path: 'assets/icons/file.svg' },
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const menuServiceMock = {
      getMenu: () => mockMenu,
    };

    const iconServiceMock = {
      getIcon: () => mockIcons,
    };

    matIconRegistrySpy = jasmine.createSpyObj('MatIconRegistry', [
      'addSvgIcon',
      'getNamedSvgIcon',
    ]);

    matIconRegistrySpy = jasmine.createSpyObj('MatIconRegistry', [
      'addSvgIcon',
      'getNamedSvgIcon',
    ]);

    // ✅ devuelve un SVG válido
    const fakeSvgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    matIconRegistrySpy.getNamedSvgIcon.and.returnValue(of(fakeSvgElement));
    // ✅ solución al error

    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);

    sanitizerSpy.bypassSecurityTrustResourceUrl.and.callFake((url) => url);

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: IconService, useValue: iconServiceMock },
        { provide: MatIconRegistry, useValue: matIconRegistrySpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },

        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el menú desde el servicio', () => {
    expect(component.listMenu.length).toBe(2);
    expect(component.listMenu[0].title).toBe('Inicio');
  });

  it('debería registrar los íconos SVG desde el servicio', () => {
    expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(2);
    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      'assets/icons/home.svg'
    );
    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      'assets/icons/file.svg'
    );
  });
});
