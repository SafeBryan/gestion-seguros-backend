import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReembolsosPendientesComponent } from './reembolsos-pendientes.component';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';

describe('ReembolsosPendientesComponent', () => {
  let component: ReembolsosPendientesComponent;
  let fixture: ComponentFixture<ReembolsosPendientesComponent>;
  let mockService: jasmine.SpyObj<ReembolsoService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockReembolsos: ReembolsoResponse[] = [
    {
      id: 1,
      contratoId: 123,
      clienteNombre: 'Juan Pérez',
      seguroNombre: 'Seguro Vida',
      monto: 250,
      descripcion: 'Consulta médica',
      estado: 'PENDIENTE',
      archivos: {},
      fechaSolicitud: '2024-06-01T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ReembolsoService', [
      'obtenerPendientes',
    ]);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReembolsosPendientesComponent],
      providers: [
        { provide: ReembolsoService, useValue: mockService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsosPendientesComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar reembolsos al inicializar', fakeAsync(() => {
    mockService.obtenerPendientes.and.returnValue(of(mockReembolsos));

    fixture.detectChanges(); // llama ngOnInit
    tick(); // procesa observables

    expect(mockService.obtenerPendientes).toHaveBeenCalled();
    expect(component.reembolsos.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.dataSource.data.length).toBe(1);
  }));
  
});
