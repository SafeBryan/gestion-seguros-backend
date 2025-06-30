import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractsClientsPaymentsComponent } from './contract-client-payments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ContratoService } from '../../core/services/contrato.service';
import { ClienteService } from '../../core/services/cliente.service';
import { PagoService } from '../../core/services/pago.service';
import { MatDialogConfig } from '@angular/material/dialog';

describe('ContractsClientsPaymentsComponent', () => {
  let component: ContractsClientsPaymentsComponent;
  let fixture: ComponentFixture<ContractsClientsPaymentsComponent>;

  let contratoSvcSpy: jasmine.SpyObj<ContratoService>;
  let clienteSvcSpy: jasmine.SpyObj<ClienteService>;
  let pagoSvcSpy: jasmine.SpyObj<PagoService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    contratoSvcSpy = jasmine.createSpyObj('ContratoService', [
      'obtenerTodosLosContratos',
    ]);
    clienteSvcSpy = jasmine.createSpyObj('ClienteService', ['obtenerCliente']);
    pagoSvcSpy = jasmine.createSpyObj('PagoService', [
      'listarPagosPorContrato',
    ]);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContractsClientsPaymentsComponent, HttpClientTestingModule],
      providers: [
        { provide: ContratoService, useValue: contratoSvcSpy },
        { provide: ClienteService, useValue: clienteSvcSpy },
        { provide: PagoService, useValue: pagoSvcSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractsClientsPaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos, clientes y pagos correctamente', () => {
    const contratosMock = [
      { id: 1, clienteId: 10 } as any,
      { id: 2, clienteId: 20 } as any,
    ];
    const clienteMock = { id: 10, nombre: 'Juan' } as any;
    const pagosMock = [{ id: 1, monto: 100 }] as any;

    contratoSvcSpy.obtenerTodosLosContratos.and.returnValue(of(contratosMock));
    clienteSvcSpy.obtenerCliente.and.returnValue(of(clienteMock));
    pagoSvcSpy.listarPagosPorContrato.and.returnValue(of(pagosMock));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.data.length).toBe(2);
    expect(component.data[0].cliente.nombre).toBe('Juan');
    expect(component.data[0].pagos.length).toBe(1);
  });

  it('debería manejar error al obtener cliente y seguir con valores por defecto', () => {
    const contratosMock = [{ id: 1, clienteId: 10 } as any];
    contratoSvcSpy.obtenerTodosLosContratos.and.returnValue(of(contratosMock));
    clienteSvcSpy.obtenerCliente.and.returnValue(
      throwError(() => new Error('Error cliente'))
    );
    pagoSvcSpy.listarPagosPorContrato.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.data.length).toBe(1);
    expect(component.data[0].cliente.nombre).toBe('(no encontrado)');
  });

  it('debería manejar error al obtener pagos y seguir con lista vacía', () => {
    const contratosMock = [{ id: 1, clienteId: 10 } as any];
    const clienteMock = { id: 10, nombre: 'Pedro' } as any;

    contratoSvcSpy.obtenerTodosLosContratos.and.returnValue(of(contratosMock));
    clienteSvcSpy.obtenerCliente.and.returnValue(of(clienteMock));
    pagoSvcSpy.listarPagosPorContrato.and.returnValue(
      throwError(() => new Error('Error pagos'))
    );

    component.ngOnInit();

    expect(component.data.length).toBe(1);
    expect(component.data[0].pagos.length).toBe(0);
  });

  it('debería abrir el diálogo cuando hay comprobante', () => {
    const pago = {
      comprobante: 'base64data',
      comprobanteTipoContenido: 'application/pdf',
    } as any;

    component.verComprobante(pago);

    expect(matDialogSpy.open).toHaveBeenCalled();
    const config = matDialogSpy.open.calls.mostRecent()
      .args[1] as MatDialogConfig<any>;
    expect(config?.data?.content).toBe('base64data');
    expect(config?.data?.contentType).toBe('application/pdf');
  });

  it('no debería abrir el diálogo si no hay comprobante', () => {
    const pago = { comprobante: null } as any;
    component.verComprobante(pago);
    expect(matDialogSpy.open).not.toHaveBeenCalled();
  });
});
