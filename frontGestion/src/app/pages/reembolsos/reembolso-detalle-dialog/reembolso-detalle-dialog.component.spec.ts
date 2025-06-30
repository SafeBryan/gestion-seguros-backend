import { ReembolsoDetalleDialogComponent } from './reembolso-detalle-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { EstadoReembolso } from '../../../models/reembolso-estado.enum';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

describe('ReembolsoDetalleDialogComponent', () => {
  let component: ReembolsoDetalleDialogComponent;
  let dialogRefMock: jasmine.SpyObj<
    MatDialogRef<ReembolsoDetalleDialogComponent>
  >;
  let reembolsoServiceMock: jasmine.SpyObj<ReembolsoService>;

  const reembolsoData: ReembolsoResponse = {
    id: 1,
    archivos: { 'archivo.pdf': 'uploads/archivo.pdf' },
    estado: EstadoReembolso.PENDIENTE,
    // otros campos que no son necesarios para estas pruebas
  } as any;

  beforeEach(() => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    reembolsoServiceMock = jasmine.createSpyObj('ReembolsoService', [
      'procesarReembolso',
    ]);

    component = new ReembolsoDetalleDialogComponent(
      reembolsoData,
      dialogRefMock,
      reembolsoServiceMock
    );
  });

  it('debería inicializar archivo correctamente', () => {
    expect(component.nombreArchivo).toBe('archivo.pdf');
    expect(component.archivoUrlCompleta).toContain('uploads/archivo.pdf');
  });

  it('debería retornar clase CSS según estado', () => {
    expect(component.getEstadoClass('PENDIENTE')).toBe('pendiente');
    expect(component.getEstadoClass('APROBADO')).toBe('aprobado');
    expect(component.getEstadoClass('RECHAZADO')).toBe('rechazado');
    expect(component.getEstadoClass('OTRO')).toBe('pendiente');
  });

  it('debería retornar icono según estado', () => {
    expect(component.getEstadoIcon('PENDIENTE')).toBe('schedule');
    expect(component.getEstadoIcon('APROBADO')).toBe('check_circle');
    expect(component.getEstadoIcon('RECHAZADO')).toBe('cancel');
    expect(component.getEstadoIcon('OTRO')).toBe('schedule');
  });

  it('debería abrir archivo en nueva pestaña si URL válida', () => {
    spyOn(window, 'open');
    component.archivoUrlCompleta = 'http://localhost:8080/uploads/archivo.pdf';
    component.abrirArchivo();
    expect(window.open).toHaveBeenCalledWith(
      'http://localhost:8080/uploads/archivo.pdf',
      '_blank'
    );
  });

  it('no debería abrir archivo si no hay URL', () => {
    spyOn(window, 'open');
    component.archivoUrlCompleta = '';
    component.abrirArchivo();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('debería cerrar diálogo al invocar cerrar()', () => {
    component.cerrar();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('debería mostrar error si se rechaza sin comentario', () => {
    spyOn(window, 'alert');
    component.comentario = '   '; // solo espacios
    component.rechazar();
    expect(component.mostrarCampoRequerido).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith(
      'Debe ingresar un comentario al rechazar la solicitud'
    );
  });

  it('debería procesar como rechazo con comentario válido', fakeAsync(() => {
    component.comentario = 'No cumple requisitos';
    reembolsoServiceMock.procesarReembolso.and.returnValue(of(undefined));

    const successSpy = spyOn<any>(component, 'mostrarExito');

    component.rechazar();
    tick();

    expect(component.procesando).toBeFalse();
    expect(successSpy).toHaveBeenCalledWith('Reembolso rechazado exitosamente');
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      realizado: true,
      tipo: 'rechazado',
      comentario: component.comentario,
    });
  }));

  it('debería procesar como aprobado sin comentario', fakeAsync(() => {
    component.comentario = '';
    reembolsoServiceMock.procesarReembolso.and.returnValue(of(undefined));

    const successSpy = spyOn<any>(component, 'mostrarExito');

    component.aprobar();
    tick();

    expect(component.procesando).toBeFalse();
    expect(successSpy).toHaveBeenCalledWith('Reembolso aprobado exitosamente');
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      realizado: true,
      tipo: 'aprobado',
      comentario: '',
    });
  }));

  it('debería manejar error al procesar reembolso', fakeAsync(() => {
    const fakeError = new Error('Error de red');
    reembolsoServiceMock.procesarReembolso.and.returnValue(
      throwError(() => fakeError)
    );

    const errorSpy = spyOn<any>(component, 'mostrarError');
    component.comentario = 'comentario de prueba';

    component.aprobar();
    tick();

    expect(errorSpy).toHaveBeenCalledWith(
      'Error al aprobar el reembolso. Intente nuevamente.'
    );
    expect(component.procesando).toBeFalse();
  }));

  it('debería retornar false en puedeSerProcesado si estado no es PENDIENTE', () => {
    component.data.estado = EstadoReembolso.APROBADO;
    expect(component.puedeSerProcesado).toBeFalse();
  });
});
