import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService, IMenu } from '../../core/services/menu.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

// Mock del servicio
class MockMenuService {
  getMenuByRol(rol: string): IMenu[] {
    return [
      { title: 'Dashboard', icon: 'dashboard' },
      { title: `Panel ${rol}`, icon: 'panel' },
    ];
  }
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuComponent,
        RouterTestingModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
      ],
      providers: [{ provide: MenuService, useClass: MockMenuService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    mockMenuService = TestBed.inject(MenuService) as unknown as MockMenuService;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer listMenu vacío si no hay usuario en localStorage', () => {
    localStorage.removeItem('UserProfile');
    component.ngOnInit();
    expect(component.listMenu).toEqual([]);
  });

  it('debería obtener el menú según el rol del usuario', () => {
    const user = {
      roles: ['ROLE_ADMIN'],
    };
    localStorage.setItem('UserProfile', JSON.stringify(user));

    component.ngOnInit();

    const expectedMenu = mockMenuService.getMenuByRol('ADMIN');
    expect(component.listMenu).toEqual(expectedMenu);
  });

  it('debería usar ROLE_INVITADO si no hay roles definidos', () => {
    const user = {};
    localStorage.setItem('UserProfile', JSON.stringify(user));

    component.ngOnInit();

    const expectedMenu = mockMenuService.getMenuByRol('INVITADO');
    expect(component.listMenu).toEqual(expectedMenu);
  });
});
