import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { SeguroService } from '../../core/services/seguro.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { Seguro } from '../../models/seguro.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockSeguroService: jasmine.SpyObj<SeguroService>;

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerTodos',
    ]);
    mockSeguroService = jasmine.createSpyObj('SeguroService', [
      'obtenerTodosLosSeguros',
    ]);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: SeguroService, useValue: mockSeguroService },
        { provide: ActivatedRoute, useValue: {} }, // Soluciona NullInjectorError
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar datos de usuarios correctamente', () => {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        nombre: 'Ana',
        apellido: 'Perez',
        activo: true,
        email: 'ana@test.com',
        rolId: 1,
      },
      {
        id: 2,
        nombre: 'Luis',
        apellido: 'Lopez',
        activo: false,
        email: 'luis@test.com',
        rolId: 2,
      },
      {
        id: 3,
        nombre: 'Jose',
        apellido: 'Diaz',
        activo: true,
        email: 'jose@test.com',
        rolId: 1,
      },
    ];

    mockUsuarioService.obtenerTodos.and.returnValue(of(mockUsuarios));

    component.cargarDatosUsuarios();

    expect(component.totalUsuarios).toBe(3);
    expect(component.usuariosActivos).toBe(2);
    expect(component.usuariosInactivos).toBe(1);
    expect(component.ultimosUsuarios[0].id).toBe(3);
    expect(component.cargandoUsuarios).toBeFalse();
  });

  it('debería manejar error al cargar usuarios', () => {
    mockUsuarioService.obtenerTodos.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.cargarDatosUsuarios();
    expect(component.cargandoUsuarios).toBeFalse();
  });

  it('debería cargar datos de seguros correctamente', () => {
    const mockSeguros: Seguro[] = [
      {
        id: 1,
        tipo: 'VIDA',
        activo: true,
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 0,
      },
      {
        id: 2,
        tipo: 'SALUD',
        activo: false,
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 0,
      },
      {
        id: 3,
        tipo: 'SALUD',
        activo: true,
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 0,
      },
    ];

    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));

    component.cargarDatosSeguros();

    expect(component.totalSeguros).toBe(3);
    expect(component.segurosSalud).toBe(2);
    expect(component.segurosVida).toBe(1);
    expect(component.segurosActivos).toBe(2);
    expect(component.segurosInactivos).toBe(1);
    expect(component.ultimosSeguros.length).toBe(3);
    expect(component.cargandoSeguros).toBeFalse();
  });

  it('debería manejar error al cargar seguros', () => {
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.cargarDatosSeguros();
    expect(component.cargandoSeguros).toBeFalse();
  });

  it('debería retornar color correcto según porcentaje', () => {
    expect(component.getProgressColor(10)).toBe('bg-danger');
    expect(component.getProgressColor(50)).toBe('bg-warning');
    expect(component.getProgressColor(90)).toBe('bg-success');
  });

  it('debería retornar iniciales del nombre y apellido', () => {
    expect(component.getInitials('Carlos', 'Gomez')).toBe('CG');
  });

  it('debería formatear precio correctamente', () => {
    const spy = spyOn(Number.prototype, 'toLocaleString').and.returnValue(
      '1.234,50'
    );
    const result = component.formatearPrecio(1234.5);
    expect(result).toBe('1.234,50');
    spy.and.callThrough();
  });

  it('debería obtener últimos 6 meses', () => {
    const meses = component.getUltimosSeisMeses();
    expect(meses.length).toBe(6);
    expect(component.meses).toContain(meses[0]);
  });

  it('debería obtener actividad de últimos meses', () => {
    const data = component.getActividadUltimosMeses('usuariosNuevos');
    expect(data.length).toBe(6);
    expect(typeof data[0]).toBe('number');
  });

  it('debería refrescar datos llamando ambos servicios', () => {
    spyOn(component, 'cargarDatosUsuarios');
    spyOn(component, 'cargarDatosSeguros');
    component.refreshData();
    expect(component.cargarDatosUsuarios).toHaveBeenCalled();
    expect(component.cargarDatosSeguros).toHaveBeenCalled();
  });
});
