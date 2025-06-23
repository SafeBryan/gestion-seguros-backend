import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosPageComponent } from './contratos-page.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { Contrato } from '../../../models/contrato.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContratosPageComponent', () => {
  let component: ContratosPageComponent;
  let fixture: ComponentFixture<ContratosPageComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ContratosPageComponent, // standalone
        MatDialogModule,
        HttpClientTestingModule, // Para servicios con HttpClient
      ],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosPageComponent);
    component = fixture.componentInstance;

    // ✅ Simulación válida de TemplateRef
    component.formDialogTemplate = jasmine.createSpyObj<TemplateRef<any>>(
      'TemplateRef',
      ['elementRef']
    );

    // ✅ Simulación que evita errores de tipo
    dialogSpy.open.and.callFake(() => dialogRefSpy);
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el modal si está abierto', () => {
    component.dialogRef = dialogRefSpy;
    component.cerrarModalFormulario();
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(component.dialogRef).toBeNull();
  });

  it('no debería fallar si se intenta cerrar modal sin estar abierto', () => {
    component.dialogRef = null;
    expect(() => component.cerrarModalFormulario()).not.toThrow();
  });

  it('debería cerrar modal al guardar', () => {
    spyOn(component, 'cerrarModalFormulario');

    // Simular componente hijo y espiar su método
    component.contratosListComponent = {
      cargarContratos: jasmine.createSpy('cargarContratos'),
    } as any;

    component.alGuardar();

    expect(component.cerrarModalFormulario).toHaveBeenCalled();
    expect(component.contratosListComponent.cargarContratos).toHaveBeenCalled();
  });

  it('debería cerrar modal al cancelar formulario', () => {
    spyOn(component, 'cerrarModalFormulario');
    component.cancelarFormulario();
    expect(component.cerrarModalFormulario).toHaveBeenCalled();
  });
});
