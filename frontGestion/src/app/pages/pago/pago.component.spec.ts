import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoComponent } from './pago.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagoService } from '../../core/services/pago.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PagoComponent', () => {
  let component: PagoComponent;
  let fixture: ComponentFixture<PagoComponent>;

  let pagoSvcSpy: jasmine.SpyObj<PagoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PagoComponent>>;

  beforeEach(async () => {
    pagoSvcSpy = jasmine.createSpyObj('PagoService', ['crearPago']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PagoComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: PagoService, useValue: pagoSvcSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { contrato: { id: 123 } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con contratoId', () => {
    expect(component.pagoForm.get('contratoId')?.value).toBe(123);
    expect(component.pagoForm.get('contratoId')?.disabled).toBeTrue();
  });

  it('no debería enviar el formulario si no se acepta términos', () => {
    component.pagoForm.patchValue({
      monto: 100,
      metodo: 'Débito',
      acepto: false,
    });

    component.onSubmit();

    expect(pagoSvcSpy.crearPago).not.toHaveBeenCalled();
  });

  it('debería cargar comprobante y convertir a base64', (done) => {
    const mockFile = new File(['dummy content'], 'comprobante.pdf', {
      type: 'application/pdf',
    });

    const input = document.createElement('input');
    input.type = 'file';
    document.body.appendChild(input);
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileChange(event);

    setTimeout(() => {
      expect(component.comprobanteNombre).toBe('comprobante.pdf');
      expect(component.comprobanteTipoContenido).toBe('application/pdf');
      expect(component.comprobanteBase64).toBeTruthy();
      done();
    }, 100); // base64 se carga async
  });

  it('debería enviar formulario válido y cerrar el diálogo', () => {
    component.pagoForm.patchValue({
      monto: 50,
      metodo: 'Efectivo',
      acepto: true,
    });

    pagoSvcSpy.crearPago.and.returnValue(of({}));
    component.onSubmit();

    expect(pagoSvcSpy.crearPago).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('pagado');
  });

  it('debería manejar error del servicio y mostrar mensaje', () => {
    component.pagoForm.patchValue({
      monto: 50,
      metodo: 'Efectivo',
      acepto: true,
    });

    const mockError = { error: { message: 'Error esperado' } };
    pagoSvcSpy.crearPago.and.returnValue(throwError(() => mockError));

    component.onSubmit();

    expect(component.mensaje).toBe('Error esperado');
    expect(component.cargando).toBeFalse();
  });
});
