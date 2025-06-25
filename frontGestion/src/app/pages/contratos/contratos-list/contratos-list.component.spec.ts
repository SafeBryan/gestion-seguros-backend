import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosListComponent } from './contratos-list.component';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Contrato } from '../../../models/contrato.model';
import { UserProfile } from '../../../models/profile-user.interface';

describe('ContratosListComponent', () => {
  let component: ContratosListComponent;
  let fixture: ComponentFixture<ContratosListComponent>;
  let mockContratoService: jasmine.SpyObj<ContratoService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockContrato: Contrato = {
    id: 1,
    clienteId: 1,
    fechaInicio: '2023-01-01',
    fechaFin: '2024-01-01',
    estado: 'ACTIVO',
    frecuenciaPago: 'MENSUAL',
    beneficiarios: [],
    dependientes: [],
    seguroId: 1,
  };

  const mockUserProfile: UserProfile = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    token: 'fake-token',
    roles: ['ROLE_CLIENTE'],
  };

  beforeEach(async () => {
    mockContratoService = jasmine.createSpyObj('ContratoService', [
      'obtenerTodosLosContratos',
      'obtenerPorCliente',
      'actualizarEstado',
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getUsuarioPerfil',
      'getUsuarioId',
    ]);

    mockAuthService.getUsuarioPerfil.and.returnValue(mockUserProfile);
    mockAuthService.getUsuarioId.and.returnValue(1);

    mockContratoService.obtenerPorCliente.and.returnValue(of([mockContrato]));

    // 👇 Esta línea es CLAVE si tu componente llama actualizarEstado en ngOnInit
    mockContratoService.actualizarEstado.and.returnValue(of(mockContrato));

    await TestBed.configureTestingModule({
      imports: [ContratosListComponent, MatSnackBarModule, MatDialogModule],
      providers: [
        { provide: ContratoService, useValue: mockContratoService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // <-- ngOnInit se llama aquí
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos para cliente', () => {
    mockContratoService.obtenerPorCliente.and.returnValue(of([mockContrato]));
    component.cargarContratos();
    expect(mockContratoService.obtenerPorCliente).toHaveBeenCalledWith(1);
  });

  it('debería manejar error al cargar contratos', () => {
    spyOn(console, 'error');
    mockContratoService.obtenerPorCliente.and.returnValue(
      throwError(() => new Error('Error de carga'))
    );
    component.cargarContratos();
    expect(component.loading).toBeFalse();
  });

  it('debería aplicar correctamente el filtro por estado', () => {
    component.contratos = [
      { ...mockContrato, estado: 'ACTIVO' },
      { ...mockContrato, estado: 'PENDIENTE', id: 2 },
    ];
    component.filtroEstado = 'ACTIVO';
    component.aplicarFiltro();
    expect(component.contratosFiltrados.length).toBe(1);
    expect(component.contratosFiltrados[0].estado).toBe('ACTIVO');
  });

  it('debería actualizar estado a CANCELADO al desactivar contrato', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.contratos = [{ ...mockContrato }];
    mockContratoService.actualizarEstado.and.returnValue(
      of({ ...mockContrato, estado: 'CANCELADO' })
    );
    component.desactivarContrato(mockContrato);
    expect(mockContratoService.actualizarEstado).toHaveBeenCalledWith(
      mockContrato.id!,
      'CANCELADO'
    );
  });

  it('debería no actualizar si el usuario cancela confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    mockContratoService.actualizarEstado.and.returnValue(of(mockContrato)); // fallback si algo lo llama

    // no ejecutar ngOnInit (ya lo hizo en beforeEach)
    component.desactivarContrato(mockContrato);

    expect(mockContratoService.actualizarEstado).not.toHaveBeenCalled();
  });

  it('debería aceptar contrato', () => {
    component.contratoActivoParaFirmar = { ...mockContrato };
    mockContratoService.actualizarEstado.and.returnValue(of(mockContrato));
    component.aceptarContrato();
    expect(mockContratoService.actualizarEstado).toHaveBeenCalledWith(
      mockContrato.id!,
      'ACEPTADO'
    );
  });

  it('debería rechazar contrato', () => {
    component.contratoActivoParaFirmar = { ...mockContrato };
    mockContratoService.actualizarEstado.and.returnValue(of(mockContrato));
    component.rechazarContrato();
    expect(mockContratoService.actualizarEstado).toHaveBeenCalledWith(
      mockContrato.id!,
      'RECHAZADO'
    );
  });

  it('debería formatear fecha correctamente', () => {
    const dateStr = '2023-05-01T00:00:00Z';
    const formatted = component.formatearFecha(dateStr);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('debería cambiar filtro de estado', () => {
    spyOn(component, 'aplicarFiltro');
    component.cambiarFiltroEstado('ACTIVO');
    expect(component.filtroEstado).toBe('ACTIVO');
    expect(component.aplicarFiltro).toHaveBeenCalled();
  });
});
