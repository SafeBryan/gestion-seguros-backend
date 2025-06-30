import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptedContractsComponent } from './accepted-contracts.component';
import { ContratoService } from '../../core/services/contrato.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Contrato } from '../../models/contrato.model';

describe('AcceptedContractsComponent', () => {
  let component: AcceptedContractsComponent;
  let fixture: ComponentFixture<AcceptedContractsComponent>;

  let contratoSvcSpy: jasmine.SpyObj<ContratoService>;
  let authSvcSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    contratoSvcSpy = jasmine.createSpyObj('ContratoService', [
      'obtenerAceptadosPorCliente',
    ]);
    authSvcSpy = jasmine.createSpyObj('AuthService', ['getUsuarioId']);

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of('pagado'));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [AcceptedContractsComponent, HttpClientTestingModule],
      providers: [
        { provide: ContratoService, useValue: contratoSvcSpy },
        { provide: AuthService, useValue: authSvcSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptedContractsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos aceptados correctamente', () => {
    const contratosMock: Contrato[] = [
      {
        id: 1,
        clienteId: 10,
        fechaInicio: '2024-01-01',
        fechaFin: '2025-01-01',
        frecuenciaPago: 'MENSUAL',
        estado: 'ACEPTADO',
        seguroId: 5,
        beneficiarios: [],
        dependientes: [],
      },
      {
        id: 2,
        clienteId: 11,
        fechaInicio: '2024-03-01',
        fechaFin: '2025-03-01',
        frecuenciaPago: 'MENSUAL',
        estado: 'ACEPTADO',
        seguroId: 6,
        beneficiarios: [],
        dependientes: [],
      },
    ];

    authSvcSpy.getUsuarioId.and.returnValue(10);
    contratoSvcSpy.obtenerAceptadosPorCliente.and.returnValue(
      of(contratosMock)
    );

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.contratos.length).toBe(2);
  });

  it('debería manejar error al cargar contratos', () => {
    authSvcSpy.getUsuarioId.and.returnValue(20);
    contratoSvcSpy.obtenerAceptadosPorCliente.and.returnValue(
      throwError(() => new Error('fallo'))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.contratos.length).toBe(0);
  });
});
