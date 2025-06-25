import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { ReembolsosPendientesComponent } from './reembolsos-pendientes.component';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';

describe('ReembolsosPendientesComponent', () => {
  let component: ReembolsosPendientesComponent;
  let fixture: ComponentFixture<ReembolsosPendientesComponent>;
  let mockService: jasmine.SpyObj<ReembolsoService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const MOCK_REEMBOLSOS: ReembolsoResponse[] = [
    {
      id: 1,
      contratoId: 123,
      clienteNombre: 'Juan Pérez',
      seguroNombre: 'Seguro Vida',
      monto: 100,
      descripcion: 'Consulta médica',
      estado: 'PENDIENTE',
      archivos: { 'recibo.pdf': 'url1' },
      fechaSolicitud: new Date().toISOString(),
    },
    {
      id: 2,
      contratoId: 456,
      clienteNombre: 'Ana Gómez',
      seguroNombre: 'Seguro Auto',
      monto: 200,
      descripcion: 'Reparación vehículo',
      estado: 'APROBADO',
      archivos: { 'factura.pdf': 'url2' },
      aprobadoPorNombre: 'Carlos Ruiz',
      comentarioRevisor: 'Todo correcto',
      fechaSolicitud: new Date().toISOString(),
      fechaRevision: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ReembolsoService', [
      'obtenerPendientes',
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReembolsosPendientesComponent],
      providers: [
        { provide: ReembolsoService, useValue: mockService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsosPendientesComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los reembolsos correctamente', () => {
    mockService.obtenerPendientes.and.returnValue(of(MOCK_REEMBOLSOS));
    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.reembolsos.length).toBe(2);
    expect(component.dataSource.data.length).toBe(2);
  });

  it('debería aplicar el filtro correctamente', () => {
    component.dataSource.data = MOCK_REEMBOLSOS;
    const inputEvent = { target: { value: 'ana' } } as unknown as Event;
    component.applyFilter(inputEvent);

    expect(component.dataSource.filter).toBe('ana');
  });

  it('debería retornar colores e íconos según estado', () => {
    expect(component.getEstadoColor('PENDIENTE')).toBe('accent');
    expect(component.getEstadoColor('APROBADO')).toBe('primary');
    expect(component.getEstadoColor('RECHAZADO')).toBe('warn');

    expect(component.getEstadoIcon('PENDIENTE')).toBe('schedule');
    expect(component.getEstadoIcon('APROBADO')).toBe('check_circle');
    expect(component.getEstadoIcon('RECHAZADO')).toBe('cancel');
  });

  it('debería formatear correctamente la fecha', () => {
    const isoDate = '2024-01-01T15:45:00Z';
    const formatted = component.formatearFecha(isoDate);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
  });

  it('trackBy debería retornar el id del reembolso', () => {
    const result = component.trackByReembolsoId(0, MOCK_REEMBOLSOS[0]);
    expect(result).toBe(1);
  });
});
