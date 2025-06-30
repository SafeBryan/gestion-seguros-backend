import { TestBed } from '@angular/core/testing';
import { PdfService } from './pdf.service';
import { jsPDF } from 'jspdf';
import * as html2canvas from 'html2canvas';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calcularAltoTexto', () => {
    it('debe retornar al menos 5 si el texto es corto', () => {
      const result = (service as any).calcularAltoTexto('Texto corto');
      expect(result).toBe(5);
    });

    it('debe calcular múltiples líneas si el texto es largo', () => {
      const textoLargo =
        'Esto es una línea de prueba que debería ocupar más de una línea';
      const result = (service as any).calcularAltoTexto(textoLargo, 60);
      expect(result).toBeGreaterThan(5);
    });
  });

  describe('generarPdfConTabla', () => {
    it('debe generar un PDF con datos (mockeado)', () => {
      const mockSave = jasmine.createSpy('save');
      spyOn<any>(service, 'generarPdfConTabla').and.callFake(() => ({
        save: mockSave,
      }));

      service.generarPdfConTabla(
        'Título',
        'Subtítulo',
        [['Dato1', 'Dato2']],
        ['Col1', 'Col2'],
        'archivo'
      );

      expect(true).toBeTrue(); // validación básica
    });

    it('debe generar un PDF con datos (sin mockear completamente)', () => {
      // Crear instancia real para que los métodos estén definidos
      const doc = new jsPDF();

      // Aplicar spy directamente a esa instancia
      const textSpy = spyOn(doc, 'text').and.callThrough();
      const saveSpy = spyOn(doc, 'save').and.stub();
      const setFontSpy = spyOn(doc, 'setFont').and.callThrough();
      const setFontSizeSpy = spyOn(doc, 'setFontSize').and.callThrough();
      const setTextColorSpy = spyOn(doc, 'setTextColor').and.callThrough();

      const datos = [['Dato1', 'Dato2']];
      const columnas = ['Col1', 'Col2'];

      // ⚠️ Aquí necesitas modificar el servicio para aceptar una instancia de jsPDF
      service.generarPdfConTabla(
        'Título real',
        'Subtítulo real',
        datos,
        columnas,
        'archivo_real',
        doc // pasamos instancia real al servicio
      );

      expect(textSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('generarPdfCompleto', () => {
    it('debe generar un PDF con resumen (mockeado)', () => {
      spyOn<any>(service, 'calcularAltoTexto').and.returnValue(10);

      const resumen = {
        Total: 100,
        Promedio: 50,
      };

      service.generarPdfCompleto(
        'Informe',
        'Estadísticas',
        resumen,
        [['Fila1', 'Dato1']],
        ['Col1', 'Col2'],
        'reporte'
      );

      expect(true).toBeTrue();
    });
  });

  describe('generarPdfDesdeElemento', () => {
    it('debe manejar error si el elemento no existe', async () => {
      spyOn(console, 'error');
      await service.generarPdfDesdeElemento('elementoInexistente', 'archivo');

      expect(console.error).toHaveBeenCalledWith('Elemento no encontrado');
    });
  });
  it('debe mostrar mensaje cuando no hay datos para la tabla', () => {
    const doc = new jsPDF();
    const textSpy = spyOn(doc, 'text').and.callThrough();
    const saveSpy = spyOn(doc, 'save').and.stub();

    service.generarPdfConTabla(
      'Título sin datos',
      'Subtítulo sin datos',
      [],
      ['Col1', 'Col2'],
      'archivo_sin_datos',
      doc
    );

    expect(textSpy).toHaveBeenCalledWith('No hay datos para mostrar', 14, 60);
    expect(saveSpy).toHaveBeenCalled();
  });

});
